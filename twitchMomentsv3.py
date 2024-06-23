import keyboard
import os
import datetime
import asyncio
from twitchio.ext import commands
from dotenv import load_dotenv
from winotify import Notification, audio
from tkinter import *
from urllib import request
from win10toast import ToastNotifier
import requests
import webbrowser
import threading
from flask import Flask, request, redirect, session, url_for, render_template
from urllib.parse import urlparse, parse_qs #need to find out how to get the url to parse it !
from twitchio.errors import HTTPException
import dbmethods

dbmethods.initDatabase()
def run_flask():
    app.run(port=5000)
app = Flask(__name__)
threading.Thread(target=run_flask).start()
#Variables
load_dotenv()
client_secret = os.getenv('TWITCH_CLIENT_SECRET')
url = os.getenv('AUTH_URL')
acc_token = ""
refr_token = ""
twitch_name = ""
twitch_id = ""
auth_cid = os.getenv('APP_CLIENT_ID')
temp_oauth = ""
#Establishing Tokens if they already exist
try:
    if(dbmethods.getAccessToken() != None and dbmethods.getRefreshToken() != None ):
        acc_token = dbmethods.getAccessToken()
        refr_token = dbmethods.getRefreshToken()
        print("AT TEST: " + acc_token)
        print("RT TEST: " + refr_token)
    else:
        pass
except:
    print("Error: No pre-existing tokens exist in the database. ")
#HTML Routes
@app.route('/')
def home():
    return render_template('index.html')
    
@app.route('/callback')
def callback():
    global auth_cid, acc_token, refr_token
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
            dbmethods.importTokens(acc_token,refr_token,expires_in)
            return "Authentication successful! Token stored in session."
        else:
            print("Failed to exchange token")
    return "Error during authentication."

#Functions
def open_browser():
    global auth_cid
    webbrowser.open_new("http://localhost:5000/")

def gotoAuthorize():
    open_browser()

def grabUserDetails():
    global twitch_name, twitch_id, acc_token
    print("acess token " + acc_token)
    headers = {
    'Authorization': f'Bearer {acc_token}',
    'Client-Id': auth_cid
    }
    
    response = requests.get('https://api.twitch.tv/helix/users', headers=headers)

    if response.status_code == 200:
        user_info = response.json()

        if user_info['data']:
            user = user_info['data'][0]
            user_id = user['id']
            twitch_id = user['id']

            twitch_name = user['display_name']
            username = user['display_name']
            print(f"User ID: {user_id}")
            print(f"Username: {username}")
            print(user_info)
        else:
            print("No user data found.")
    else:
        print(f"Failed to get user information: {response.status_code} - {response.text}")
    print("url")

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
    grabUserDetails()
    clipped = Notification(app_id="enzynclipper", 
                           title="Clipped !", 
                           msg="You have clipped the last 30 seconds to your Twitch !", 
                           duration="short")
    clipped.show()
    global twitch_name, twitch_id, acc_token
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        bot = Bot()
    except HTTPException as htperr:
        if htperr.status == 401:
            refreshAccessToken()
        if htperr.status == 404:
            print(htperr.reason)
            return
    User = bot.create_user(twitch_id,twitch_name)
    print(twitch_id)
    print(twitch_name)
    try:
        clip_url = loop.run_until_complete(User.create_clip(token=acc_token))
    except HTTPException as htperr:
        if htperr.status == 401:
            refreshAccessToken()
        if htperr.status == 404:
            print(htperr.reason)
            return
            
    with open('url_clips.txt', 'a') as f:
        f.write("Date: " + str(datetime.datetime.today()) + " | Clip Details: " + str(clip_url['edit_url']) + '\n')
        f.close()
    print("done")

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

root = Tk()
myButton_1 = Button(root, text="Authorize your Twitch Account", command=gotoAuthorize)
myButton_1.pack()
root.mainloop()
