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

import eventlet
import eventlet.wsgi

# Print the current working directory
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
logger.info("This is an informational message")

dbmethods.initDatabase()

    
if getattr(sys, 'frozen', False):
    base_dir = os.path.dirname(sys.executable)
    app = Flask(__name__, static_folder=os.path.join(base_dir,'build'), static_url_path='')
    socketio = SocketIO(app, cors_allowed_origins="*", async_mode='eventlet')
    authHTML = "./build/auth.html"
    print("sys test")
elif __file__:
    base_dir = os.path.dirname(__file__)
    app = Flask(__name__)
    socketio = SocketIO(app, cors_allowed_origins="*", async_mode='eventlet')
    authHTML = "base.html"
    print("file test")
    

CORS(app)


def run_flask():
    from waitress import serve
    eventlet.wsgi.server(eventlet.listen(('0.0.0.0', 5000)), app)
    logger.info("Flask server started successfully.")


try:
    threading.Thread(target=run_flask).start()
    
except Exception as e:
    logger.error(f"Error starting Flask server: {e}")




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
temp_oauth = ""
user_id = ""



#Establishing Tokens if they already exist
try:
    if(dbmethods.getAccessToken() != None and dbmethods.getRefreshToken() != None ):
        acc_token = dbmethods.getAccessToken()
        refr_token = dbmethods.getRefreshToken()
    else:
        pass
except:
    print("Error: No pre-existing tokens exist in the database. ")
#HTML Routes
@app.route('/authorizeFlask1')
def hello():
    return send_from_directory(app.static_folder,"auth.html")

@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')


@app.route('/authorizeFlask')
def home():
    return render_template('base.html')
    
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
            dbmethods.updateTokens(acc_token,refr_token, twitch_name, profile_pic_url, expires_in )
            return redirect("http://localhost:5173")
    
    return redirect("http://localhost:5173")

@app.route('/callbackRender')
def callbackRender():
    dname, url = dbmethods.getUserDetails()
    user_profile = {'display_name': dname, 'profile_pic_url': url}
    return jsonify(user_profile)

@app.route('/clips', methods=['GET'])
def get_clips():
    clips = dbmethods.get_clips()
    return jsonify(clips)

@app.route('/getLink', methods=['POST'])
def get_link():
    slug = request.get_json()
    link = dbmethods.get_link(slug)
    return jsonify(link)
@app.route('/removeClip', methods=['POST'])
def remove_List():
    slug = request.get_json()
    dbmethods.remove_clips(slug)
    return jsonify("Successful")

@socketio.on('connect')
def handle_connect():
    emit('response', {'data': 'Connected to server'}, broadcast=True)

@socketio.on('message')
def handle_message(message):
    emit('response', {'data': message['data']}, broadcast=True)


#Functions
def open_auth():
    global auth_cid
    webbrowser.open_new("http://localhost:5000/authorizeFlask1")

def gotoAuthorize():
    open_auth()

def grabUserDetails():
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
            username = user['display_name']
            profile_pic_url = user['profile_image_url']
            print(f"User ID: {user_id}")
            print(f"Username: {username}")
            # print(user_info)
        else:
            print("No user data found.")
    else:
        print(f"Failed to get user information: {response.status_code} - {response.text}")
        refreshAccessToken()
        grabUserDetails()




def grabGame():
    global twitch_name, twitch_id, acc_token, auth_cid, user_id
    print("acess token " + acc_token)
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











def notyChecker():

    # toaster = ToastNotifier()
    print("Test")
    # toaster.show_toast("Clipped !","You have clipped the last 30 seconds to your Twitch !", duration=10)
    toast = Notification(app_id="enzynclipper", 
                         title="Clipped !", 
                         msg="You have clipped the last 30 seconds to your Twitch !")
    toast.set_audio(audio.Default, loop=False)
    print("Notification created")
    toast.show()
    print("Notification shown")

class Bot(commands.Bot):

    def __init__(self):
        global twitch_name,acc_token

        super().__init__(token=acc_token, prefix='', initial_channels=[twitch_name])
    

    async def event_ready(self):
        print(f'Logged in as | {self.nick}')
        print(f'User id is | {self.user_id}')
        
            
    def create_user(self, user_id: int, user_name: str):
        return super().create_user(user_id, user_name)

def clip_creator():
    global twitch_name, twitch_id, acc_token, twitch_id
  
    duration = 200  # milliseconds
    freq = 440  # Hz
    winsound.Beep(freq, duration)
    print("uid: "+ twitch_id)
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

        with open('url_clips.txt', 'a') as f:
            f.write("Date: " + str(  (datetime.datetime.now()).strftime("%x")  ) + "Date: " + str(  (datetime.datetime.now()).strftime("%X")  ) +  " | Clip Details: " + str(clip_url['edit_url']) + '\n')
            f.close()
        print("done")
    except HTTPException as htperr:
        if htperr.status == 401:
            refreshAccessToken()
        if htperr.status == 404:
            print(htperr.reason)
            return
    except ValueError as verr:
        print("Test")
    



def createaClip():
    keyboard.add_hotkey('Ctrl+Alt+L', clip_creator)
    keyboard.wait()

def refreshAccessToken():
        global acc_token, refr_token
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
        else:
            print("Failed to exchange token")
#Threads & Main
keyboard_thread = threading.Thread(target=createaClip)
keyboard_thread.daemon = True  
keyboard_thread.start()

async def main():
    loop = asyncio.new_event_loop()                                                                                                                             
    loop.run_until_complete(main())
