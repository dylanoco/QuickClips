import os
import datetime
import asyncio
from twitchio.ext import commands
from dotenv import load_dotenv
from winotify import Notification, audio
from urllib import request
from win10toast import ToastNotifier
import requests
import webbrowser
import threading
from flask import Flask, request, redirect, session, url_for, render_template, jsonify, send_from_directory
from flask_socketio import SocketIO, emit
from urllib.parse import urlparse, parse_qs #need to find out how to get the url to parse it !
from twitchio.errors import HTTPException
import dbmethods
from flask_cors import CORS
import logging
import keyboard
import sys
import winsound
import logging
import os
import time
import eventlet
import eventlet.wsgi
import json
#AUTH KEY NOT BEING VERIFIED PROPERLY WHEN LAUNCHING ELECTRON. TEST AUTHKEY, IF IT NEEDS CHANGING THEN RUN REFRESHTOKEN FUNCTION
#Variables
load_dotenv()
client_secret = os.getenv('TWITCH_CLIENT_SECRET')
url = os.getenv('AUTH_URL')
acc_token = ""
refr_token = ""
twitch_name = ""
profile_pic_url = ""
twitch_id = ""
auth_cid = os.getenv('APP_CLIENT_ID')
hotkey = 'Ctrl+Alt+L'
expires_in = ""
print(f"Current working directory: {os.getcwd()}")
authHTML = ""

# Configure the logging
logging.basicConfig(level=logging.DEBUG,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
                    handlers=[
                        logging.FileHandler("example.log"),
                        logging.StreamHandler()
                    ])

logger = logging.getLogger(__name__)

# Initializing the Database
dbmethods.initDatabase()


# To check whether if the app is being launched with the executable or normally through .py script (Deployment vs Development)  
if getattr(sys, 'frozen', False):
    base_dir = os.path.dirname(sys.executable)
    app = Flask(__name__, static_folder=os.path.join(base_dir,'build'), static_url_path='')
    socketio = SocketIO(app, cors_allowed_origins="*", async_mode='eventlet',logger=True, engineio_logger=True)
    authHTML = "./build/auth.html"
    print("sys test")
elif __file__:
    base_dir = os.path.dirname(__file__)
    app = Flask(__name__)
    socketio = SocketIO(app, cors_allowed_origins="*", async_mode='eventlet', engineio_logger=True)
    authHTML = "base.html"
    print("file test")

# Used to get basic user information from Twitch API.
def grabUserDetails():
    print("GRABBING. DETAILS")
    global twitch_name, twitch_id, acc_token, auth_cid, profile_pic_url
    print("access token " + acc_token)
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
            print(f"User ID: {twitch_id}")
            print(f"Username: {twitch_name}")
        else:
            print("No user data found.")
    else:
        print(f"Failed to get user information: {response.status_code} - {response.text}")
        refreshAccessToken()
        grabUserDetails()
    return print("UserID: " + twitch_id)

#Establishing Tokens if they already exist
if(dbmethods.getAccessToken() != None and dbmethods.getRefreshToken() != None ):
    acc_token = dbmethods.getAccessToken()
    refr_token = dbmethods.getRefreshToken()
    hotkey = dbmethods.getHotkey()
    grabUserDetails()
    print("TRY EXCEPT SUCCEEDED. ACC_TOKEN,REFR_TOKEN,HOTKEY" + acc_token + refr_token + hotkey)
else:
    print("Try Except Failed.")

CORS(app)

# Run the flask server on port 5000
def run_flask():
    socketio.run(app, host='0.0.0.0', port=5000)
    logger.info("Flask server started successfully.")
    print("Flask server started successfully.")

try:
    threading.Thread(target=run_flask).start()
except Exception as e:
    logger.error(f"Error starting Flask server: {e}")




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
    return render_template('base.html')
# Callback route from when collecting tokens from Twitch API
@app.route('/callback')
def callback():
    global auth_cid, acc_token, refr_token,twitch_name, profile_pic_url
    print("Callback route accessed")
    code = request.args.get('code')
    print(f"Authorization code received: {code}")
    if code:
        token_url = "https://id.twitch.tv/oauth2/token"
        data = {
            "client_id": "s47rucw584h54boq3v35nwgg8vnxws",
            "client_secret": client_secret,
            "code": code,
            "grant_type": "authorization_code",
            "redirect_uri": "http://localhost:5000/callback"
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
            return redirect("http://localhost:5173")
    
    return redirect("http://localhost:5173")

# Route used to get the Profile Picture and Dispaly Name. Requests made from Client.
@app.route('/callbackRender')
def callbackRender():
    global hotkey, expires_in
    # refreshAccessToken()
    # grabUserDetails()
    # dbmethods.updateTokens(acc_token,refr_token, twitch_name, profile_pic_url, expires_in ,hotkey)
    dname, url = dbmethods.getUserDetails()
    print(dname + url)
    user_profile = {'display_name': dname, 'profile_pic_url': url, 'hotkey': hotkey}
    return jsonify(user_profile)

# Request from Client, to send over clips from Database
@app.route('/clips', methods=['GET'])
def get_clips():
    clips = dbmethods.get_clips()
    return jsonify(clips)

#Request from Client, to get the clips of the link from Database.
@app.route('/getLink', methods=['POST'])
def get_link():
    slug = request.get_json()
    link = dbmethods.get_link(slug)
    return jsonify(link)

# Request from Client to remove clip from database.
@app.route('/removeClip', methods=['POST'])
def remove_List():
    slug = request.get_json()
    dbmethods.remove_clips(slug)
    return jsonify("Successful")




# Handle WebSocket events

#trigger_key Is to post a message to the client to re-render the app. Usually for when a clip has been made.
def trigger_key():
    requests.post('http://localhost:5000/trigger-message')
@app.route('/trigger-message', methods=['POST'])
def trigger_message():
    with app.app_context():
        socketio.emit('refresh-clips', {'data': 'Manual trigger from Flask!'})
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



# To grab the game being played from the user at the time of creating the clip
def grabGame():
    global twitch_name, twitch_id, acc_token, auth_cid
    print("access token " + acc_token)
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
            return


# Initializes the 'Bot' to create clips, etc.
class Bot(commands.Bot):
    def __init__(self):
        global twitch_name,acc_token
        super().__init__(token=acc_token, prefix='', initial_channels=[twitch_name])
    async def event_ready(self):
        print(f'Logged in as | {self.nick}')
        print(f'User id is | {self.user_id}')  
    def create_user(self, user_id: int, user_name: str):
        return super().create_user(user_id, user_name)
# The Main function to create clips
def clip_creator():
    global twitch_name, twitch_id, acc_token, twitch_id
    print(hotkey)
    #Temp way of notifying a clip has been made.
    # duration = 150  # milliseconds
    # freq = 3000 # Hz
    # winsound.Beep(freq, duration)
    print("User ID: "+ twitch_id)
    clipped = Notification(app_id="enzynclipper", 
                           title="Clipped !", 
                           msg="You have clipped the last 30 seconds to your Twitch !", 
                           duration="short")
    clipped.show()
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    
    try:
        bot = Bot()
        User = bot.create_user(twitch_id,twitch_name)
        clip_url = loop.run_until_complete(User.create_clip(token=acc_token))
        game_name = grabGame()
        print(game_name)
        dbmethods.insertClip(clip_url['id'],clip_url['edit_url'],str(  (datetime.datetime.now()).strftime("%x")  ) ,str(  (datetime.datetime.now()).strftime("%X")  ),game_name)
    except HTTPException as htperr:
        if htperr.status == 401:
            refreshAccessToken()
        if htperr.status == 404:
            print(htperr.reason)
            return
    except ValueError as verr:
        print("Value Error")
        print("UserID: " + twitch_id)
        print(verr)
    print("Sending over the Refresh Clips Signal")
    trigger_key()
    print("Sent the refresh clips signal.")

# Function used to wait for a hotkeypress to create a clip.
def createaClip():
    keyboard.add_hotkey(hotkey, clip_creator)
    keyboard.wait()

# Necessary for creating a new access token incase it expires.
def refreshAccessToken():
        global acc_token, refr_token, expires_in
        token_url = "https://id.twitch.tv/oauth2/token"
        data = {
            "client_id": "s47rucw584h54boq3v35nwgg8vnxws",
            "client_secret": client_secret,
            "grant_type": "refresh_token",
            "refresh_token": refr_token
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
        else:
            print("Failed to exchange token")
#Threads & Main
keyboard_thread = threading.Thread(target=createaClip)
keyboard_thread.daemon = True  
keyboard_thread.start()

keyboard_thread.join()



async def main():
    eventlet.monkey_patch()
    loop = asyncio.new_event_loop()                                                                                                                             
    loop.run_until_complete(main())
