import os
import datetime
import asyncio
import twitchio
import twitchio.ext
from twitchio.ext import commands
from dotenv import load_dotenv
from urllib import request
import requests
import threading
from flask import Flask, request, redirect, session, url_for, render_template, jsonify, send_from_directory
from flask_socketio import SocketIO, emit
from urllib.parse import urlparse, parse_qs #need to find out how to get the url to parse it !
import dbmethods
from flask_cors import CORS
import logging
import keyboard 
import sys
import eventlet
import eventlet.wsgi
import json
import resend
from engineio.async_drivers import gevent
from pathlib import Path
import psutil
import signal
import sys
from supabase import create_client, Client
import yt_dlp

from config import (
    SUPABASE_URL,
    SUPABASE_KEY,
    client_secret,
    url,
    auth_cid,
    hostingLink,
    localHost,
    resend_api_key,
    bugEmail
)



#This is needed to make sure that the backend doesn't linger after the program is closed.

def clean_exit(signum, frame):
    print(f"Received signal {signum}, cleaning up...")
    try:
        parent = psutil.Process(os.getpid())
        for child in parent.children(recursive=True):
            print(f"Killing child process {child.pid}")
            child.kill()
        parent.kill()  # Finally kill yourself
    except Exception as e:
        print(f"Error during cleanup: {e}")
    finally:
        sys.exit(0)

signal.signal(signal.SIGINT, clean_exit)   # Ctrl+C or interrupt
signal.signal(signal.SIGTERM, clean_exit)  # Termination (kill signal)
if os.name == 'nt':
    try:
        signal.signal(signal.SIGBREAK, clean_exit)
    except AttributeError:
        pass 

#Variables
load_dotenv()
# Get the directory of the running script (handles both dev & PyInstaller cases)
BASE_DIR = Path(getattr(sys, '_MEIPASS', Path(__file__).parent))

# Load .env from the correct directory
dotenv_path = BASE_DIR / ".env"
if dotenv_path.exists():
    load_dotenv(dotenv_path)
else:
    print("Warning: .env file not found!")


# client_secret = os.getenv('TWITCH_CLIENT_SECRET')
# url = os.getenv('AUTH_URL')
# auth_cid = os.getenv('APP_CLIENT_ID')
# hostingLink = os.getenv('APP_URL')
# localHost = os.getenv('LOCAL_HOST')    
resend.api_key = resend_api_key
# bugEmail = os.getenv("BUG_EMAIL")
# supabaseURL = os.getenv("SUPABASE_URL")
# supabaseKey = os.getenv("SUPABASE_KEY")
acc_token = ""
refr_token = ""
twitch_name = ""
profile_pic_url = ""
twitch_id = ""
hotkey = 'Ctrl+Alt+L'
expires_in = ""
# print(f"Current working directory: {os.getcwd()}")
authHTML = ""

# Initializes the 'Bot' to create clips, etc.
class Bot(commands.Bot):
    def __init__(self):
        global twitch_name, acc_token, auth_cid, client_secret, twitch_id
        super().__init__(
            token=acc_token, 
            prefix='', 
            initial_channels=[twitch_name],
            client_id=auth_cid,
            client_secret=client_secret,
            bot_id=int(twitch_id) if twitch_id else None 
        )
    async def event_ready(self):
        print(f'Logged in as | {self.nick}')
        print(f'User id is | {self.user_id}')  
    def create_user(self, user_id: int, user_name: str):
        return super().create_user(user_id, user_name)
    
bot = None
loop = None





# Configure the logging
# logging.basicConfig(level=logging.DEBUG,
#                     format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
#                     handlers=[
#                         logging.FileHandler("example.log"),
#                         logging.StreamHandler()
#                     ])

# logger = logging.getLogger(__name__)
# Initializing the Database
dbmethods.initDatabase()

print("test1")
app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='gevent')
print("test2")

    # Necessary for creating a new access token incase it expires.
def refreshAccessToken():
    global acc_token, refr_token, expires_in, bot, loop, twitch_id
    token_url = "https://id.twitch.tv/oauth2/token"
    data = {
        "client_id": auth_cid,
        "client_secret": client_secret,
        "grant_type": "refresh_token",
        "refresh_token": refr_token
    }
    print("Sending POST request to exchange code for token")
    try:
        response = requests.post(token_url, data=data)
        print(f"Response status code: {response.status_code}")
        print(f"Response content: {response.text}")
        if response.status_code == 200:
            print("Token exchange successful")
            token_info = response.json()
            acc_token = token_info['access_token']
            refr_token = token_info['refresh_token']
            expires_in = token_info['expires_in']
            grabUserDetails()  # This sets twitch_id
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            # Only create bot AFTER we have twitch_id
            if twitch_id:
                bot = Bot()
            return "Success"
        else:
            print("Failed to exchange token")
            return "Failed"
    except Exception as e:
        print(f"Error in refreshAccessToken: {e}")
        return "Failed"

def validateToken():
    global acc_token, bot, loop, twitch_id
    token_url = "https://id.twitch.tv/oauth2/validate"
    headers = {
        'Authorization': f'Bearer {acc_token}'
    }
    print("Sending GET request to validate access token")
    response = requests.get(token_url, headers=headers)
    print(f"Response status code: {response.status_code}")
    print(f"Response content: {response.text}")
    if response.status_code == 200:
        print("Token validated.")
        grabUserDetails()  # This sets twitch_id
        if loop == None:
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
        # Only create bot AFTER we have twitch_id AND if bot doesn't exist
        if bot == None and twitch_id:
            bot = Bot()
        return response.status_code
    else:
        print("Failed to validate token. Using Refresh Token ...")
        try:
            if (refreshAccessToken() == "Failed"):
                print("Refresh Token Failed.")
                return "Failed"
            else:
                return response.status_code
        except Exception as e:
            print(f"Error in validateToken: {e}")
            return "Failed"

        

# Used to get basic user information from Twitch API.
def grabUserDetails():
    print("Grabbing Details ...")
    global twitch_name, twitch_id, acc_token, auth_cid, profile_pic_url
    headers = {
    'Authorization': f'Bearer {acc_token}',
    'Client-Id': auth_cid
    }
    response = requests.get('https://api.twitch.tv/helix/users', headers=headers)

    if response.status_code == 200:
        user_info = response.json()

        if user_info['data']:
            user = user_info['data'][0]
            twitch_id = user['id']
            twitch_name = user['display_name']
            profile_pic_url = user['profile_image_url']
            print(f"Username: {twitch_name}")
        else:
            print("No user data found.")
    else:
        print(f"Failed to get user information: {response.status_code} - {response.text}")
        refreshAccessToken()
        grabUserDetails()
    return print("UserID (GrabUserDetails): " + twitch_id)

CORS(app)
#Establishing Tokens if they already exist
# Run the flask server on port 5000
def run_flask():
    socketio.run(app, host='0.0.0.0', port=5000)
    # logger.info("Flask server started successfully.")
    print(f"Flask server started successfully.")
#HTML Routes

# Differ from Deployment vs. Development
@app.route('/authorizeFlask1')
def hello():
    return send_from_directory(app.static_folder,"auth.html")
@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')
@app.route('/authorizeFlask')
def home():
    return render_template("auth.html")
    # return send_from_directory(app.static_folder,"auth.html")

    
# Callback route from when collecting tokens from Twitch API
@app.route('/callback')
def callback():
    global auth_cid, acc_token, refr_token,twitch_name, profile_pic_url
    print("HTML REDIRECTING TO APP")
    print("Callback Route Accessed")
    code = request.args.get('code')
    print(f"Authorization code received.")
    if code:
        token_url = "https://id.twitch.tv/oauth2/token"
        data = {
            "client_id": auth_cid,
            "client_secret": client_secret,
            "code": code,
            "grant_type": "authorization_code",
            "redirect_uri": f"{localHost}/callback"
        }
        print("Sending POST request to exchange code for token")
        response = requests.post(token_url, data=data)
        print(f"Response status code: {response.status_code}")
        print(f"Response content: {response.text}")
        
        if response.status_code == 200:
            print("Token exchange successful")
            token_info = response.json()
            acc_token = token_info['access_token']
            refr_token = token_info['refresh_token']
            expires_in = token_info['expires_in']
            grabUserDetails()
            dbmethods.updateTokens(acc_token,refr_token, twitch_name, profile_pic_url, expires_in,hotkey)
            socketio.emit('authenticated', {'status': 'success'})
        return """
        <html>
        <head><title>Authentication Complete</title></head>
        <body style="background-color:#1e1e2f; color:white; text-align:center; font-family:sans-serif;">
            <h2>You’re logged in. You can close this tab.</h2>
            <script>
            setTimeout(() => window.close(), 2000);
            </script>
        </body>
        </html>
        """
    socketio.emit('authenticated', {'status': 'success'})
    return  """
        <html>
        <head><title>Authentication Complete</title></head>
        <body style="background-color:#1e1e2f; color:white; text-align:center; font-family:sans-serif;">
            <h2>Authentication Failed. You can close this tab.</h2>
            <script>
            setTimeout(() => window.close(), 2000);
            </script>
        </body>
        </html>
        """

# Route used to get the Profile Picture and Dispaly Name. Requests made from Client.
@app.route('/callbackRender')
def callbackRender():
    global hotkey, expires_in

    user_profile = None

    if(validateToken() != "Failed"):
        try:
            dname, url = dbmethods.getUserDetails()
            user_profile = {'display_name': dname, 'profile_pic_url': url, 'hotkey': hotkey}
        except:
            dname = None
            url = None
            user_profile = ""
        
    
    return jsonify(user_profile)

# Request from Client, to send over clips from Database
@app.route('/clips', methods=['GET'])
def get_clips():
    clips = dbmethods.get_clips()
    return jsonify(clips)

@app.route('/BugReport', methods=['POST'])
def BugReport():
    global bugEmail, SUPABASE_URL, SUPABASE_KEY

    print("Sending Email ...")
    data = request.get_json()
    params: resend.Emails.SendParams = {
        "from": bugEmail,
        "to": [data['email']],
        "subject": "Bug Report Recieved",
        "html": data['bugDescription'], 
    }
    print(params)
    email = resend.Emails.send(params)
    print(email)
    print(data['rawDescription'])
    reportSuccessful = "Email Successfully Sent"
    
    #Supabase code to send the bug report to the database.
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    params = {
        "email": data['email'],
        "bugdescription": data['rawDescription'],
        "created_at": datetime.datetime.now().isoformat()
    }
    supabase.table("bug_reports").insert(params).execute()



    return jsonify(reportSuccessful)

#Request from Client, to get the clips of the link from Database.
@app.route('/getLink', methods=['POST'])
def get_link():
    slug = request.get_json()
    link = dbmethods.get_link(slug)
    return jsonify(link)

#Route to get the MP4 link of the clip
@app.route('/getLinkMP4', methods=['POST'])
def get_link_mp4():
    slug = request.get_json()
    link = dbmethods.get_link(slug)
    print(f"Link: {link[0]}")
    ydl_opts = {
        'quiet': True,
        'skip_download': True
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(link[0], download=False)
        print(f"Info: {info.get('url')}")
        return jsonify({"link": info.get('url')})

# Request from Client to remove clip from database.
@app.route('/removeClip', methods=['POST'])
def remove_List():
    print("Removing Clip ...")
    slug = request.get_json()
    dbmethods.remove_clips(slug)
    return jsonify("Successful")

# Load version from JSON file
def get_backend_version():
    version_file_path = BASE_DIR / "version.json"
    with open(version_file_path, "r") as f:
        version_data = json.load(f)
    return version_data["backend_version"]

@app.route('/api/version', methods=['GET'])
def get_version():
    print("GET /api/version called")  # Debugging
    version = get_backend_version()
    response = jsonify({"backend_version": version})
    print(f"Response: {response}")  # Debugging
    print(f"Backend version: {version}")  # Debugging
    return jsonify({"backend_version": get_backend_version()})


# Handle WebSocket events

#trigger_key Is to post a message to the client to re-render the app. Usually for when a clip has been made.
def trigger_key(status, process, reason):
    if status == True:
        requests.post(f'{localHost}/trigger-message-success')
    else:
        requests.post(f'{localHost}/trigger-message-fail', data={'reason': reason, 'process' : process})
@app.route('/trigger-message-success', methods=['POST'])
def trigger_message_s():
    with app.app_context():
        socketio.emit('refresh-clips', {'data': 'Clip Created Successfully!'})
    return "Message sent!", 200
@app.route('/trigger-message-fail', methods=['POST'])
def trigger_message_f():

    data =  request.form.get('reason', 'No reason provided')
    process =  request.form.get('process', 'No process provided')
    with app.app_context():
        socketio.emit('refresh-clips', {'data': f'{process}. {data}'})
    return "Message sent!", 200

# Hotkey assign for when the user wants to change the hotkey
@socketio.on('hotkey-assign')
def recieve_hotkey(json):
    print("Recieved Hotkey: " + json)
    hotkey_assign(json)



# Functions

# Hotkey assign function to be used to assign a different hotkey.
def hotkey_assign(hk):
    global hotkey
    keyboard.remove_hotkey(hotkey)
    hotkey = hk
    print(hotkey)
    keyboard.add_hotkey(hk, clip_creator)
    #Change Hotkey in Database Code Here.
    dbmethods.updateHotkey(hk)

import time
import winsound



# To grab the game being played from the user at the time of creating the clip
def grabGame():
    global twitch_name, twitch_id, acc_token, auth_cid
    headers = {
    'Authorization': f'Bearer {acc_token}',
    'Client-Id': auth_cid
    }
    try:
        url = "https://api.twitch.tv/helix/channels?broadcaster_id=" + twitch_id
        response = requests.get(url, headers=headers)

        if response.status_code == 200:
            user_info = response.json()

            if user_info['data']:
                user = user_info['data'][0]
                game_name = user['game_name']
                return game_name
            else:
                print("No user data found.")
                return "Empty 1"
        else:
            print(f"Failed to get user information: {response.status_code} - {response.text}")
            return "Empty 2"
    except HTTPException as htperr:
        if htperr.status == 401:
            refreshAccessToken()
        if htperr.status == 404:
            print(htperr.reason)
            trigger_key(False, "Clip Creation", htperr.reason)
            return
        



# The Main function to create clips
def ClipFunction():
        global twitch_name, twitch_id, acc_token, bot, loop
        if validateToken() != "Failed":
            User = bot.create_user(twitch_id, twitch_name)
            clip_url = loop.run_until_complete(User.create_clip(token=acc_token))
            game_name = grabGame()
            clip_link = "https://www.twitch.tv/" + twitch_name  +  "/clip/"+ clip_url['id']

            dbmethods.insertClip(
                clip_url['id'],
                clip_link,
                str(datetime.datetime.now().strftime("%x")),
                str(datetime.datetime.now().strftime("%X")),
                game_name
            )
            trigger_key(True, "Clip Creation", "Successfully created a clip.")

def clip_creator():
    try:
        ClipFunction()
    except twitchio.errors.HTTPException as htperr:
        if htperr.status == 401:
            refreshAccessToken()
            try:
                ClipFunction()
            except Exception as retry_err:
                trigger_key(False, "Clip Creation", f"Token refreshed but retry failed: {retry_err}")
        elif htperr.status == 404:
            trigger_key(False, "Clip Creation", "The channel is not online. Please go live before creating a clip.")
        elif htperr.status == 403:
            trigger_key(False, "Clip Creation", "You must authorize your Twitch account before creating a clip.")
        return

    except ValueError as verr:
        trigger_key(False, "Clip Creation", str(verr))
        return
    
def clip_creator_safe():
    try:
        clip_creator()
    except Exception as e:
        print(f"[clip_creator_safe] Uncaught error: {e}")



# Function used to wait for a hotkeypress to create a clip.
def createaClip():
    keyboard.add_hotkey(hotkey, lambda: threading.Thread(target=clip_creator_safe).start())
    keyboard.wait()







 






















#Threads & Main
try:
    threading.Thread(target=run_flask,daemon=True).start()
    #threading.Thread(target=token_validation_thread, daemon=True).start()
    #if tokens not valid, refresh them,and update db. if cant refresh them, invalidate all tokens and request re-authentication.
    acc_token = dbmethods.getAccessToken()
    refr_token = dbmethods.getRefreshToken()
    hotkey = dbmethods.getHotkey()
    #validateToken()
    if (validateToken() != "Failed"):
        # logger.info("TRY EXCEPT SUCCEEDED. ACC_TOKEN,REFR_TOKEN,HOTKEY")
        print("TRY EXCEPT SUCCEEDED. ACC_TOKEN,REFR_TOKEN,HOTKEY")
except Exception as e:
    #logger.error(f"Error starting Flask server: {e}")
    print(f"Error starting Flask server: {e}")
    import traceback
    traceback.print_exc()

    input("🔁 Press Enter to exit...")
    
keyboard_thread = threading.Thread(target=createaClip)
keyboard_thread.daemon = True  
keyboard_thread.start()
keyboard_thread.join()


async def main():
    try:
        eventlet.monkey_patch()
        loop = asyncio.new_event_loop()                                                                                                                             
        loop.run_until_complete(main())
    except Exception as e:  
        input(f"Error: {e}")
