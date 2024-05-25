import keyboard
import os
import datetime
import asyncio
from twitchio.ext import commands
from dotenv import load_dotenv
from winotify import Notification
from tkinter import *
from urllib import request

import requests
import webbrowser
#from pynput import keyboard

from urllib.parse import urlparse, parse_qs #need to find out how to get the url to parse it !

#need to find out what else the redirect url is supposed to be, to retrieve the params after its authorized
#might possibly need a server
#make a button which is pressed when user is authorized

twitch_oautht = os.getenv('TWITCH_OAUTH_TOKEN')
twitch_name = ""
twitch_id = os.getenv('TWITCH_USER_ID')
twitch_ut = os.getenv('TWITCH_USER_TOKEN')
twitch_auth_url = os.getenv('AUTH_URL')

auth_cid = os.getenv('APP_CLIENT_ID')
auth_rurl = os.getenv('APP_REDIRECT_URL')


temp_oauth = 'ly1osndu7sulbp22w8c7yu0flkf0mc'


headers = {
    'Authorization': f'Bearer {temp_oauth}',
    'Client-Id': auth_cid
}

    
load_dotenv()
url = os.getenv('AUTH_URL')
def gotoAuthorize():
    print(url)
    webbrowser.open(url)
def gotoVerify():
    global twitch_name, twitch_id
    
    # Make a request to the Twitch API to get user information
    response = requests.get('https://api.twitch.tv/helix/users', headers=headers)

    # Check if the request was successful
    if response.status_code == 200:
        user_info = response.json()
        # The user information is in the 'data' field, which is a list
        if user_info['data']:
            user = user_info['data'][0]
            user_id = user['id']
            twitch_id = user['id']

            twitch_name = user['display_name']
            username = user['display_name']
            print(f"User ID: {user_id}")
            print(f"Username: {username}")
        else:
            print("No user data found.")
    else:
        print(f"Failed to get user information: {response.status_code} - {response.text}")
    print("url")














class Bot(commands.Bot):

    def __init__(self):
        global twitch_name, temp_oauth

        super().__init__(token=temp_oauth, prefix='', initial_channels=[twitch_name])
    

    async def event_ready(self):
        print(f'Logged in as | {self.nick}')
        print(f'User id is | {self.user_id}')
        
            
    def create_user(self, user_id: int, user_name: str):
        return super().create_user(user_id, user_name)
def clip_creator():
    gotoVerify()
    print("sjdhbfsd")
    clipped = Notification("ENZYNClipper", "Clipped !", "You have clipped the last 30 seconds to your Twitch !", duration="short")
    global twitch_name, twitch_id, temp_oauth
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    bot = Bot()
    User = bot.create_user(twitch_id,twitch_name)
    print(twitch_id)
    print(twitch_name)
    print(temp_oauth)
    clip_url = loop.run_until_complete(User.create_clip(token=temp_oauth))
    with open('url_clips.txt', 'a') as f:
        f.write("Date: " + str(datetime.datetime.today()) + " | Clip Details: " + str(clip_url['edit_url']) + '\n')
        f.close()
    clipped.add_actions(label="Link to edit clip", launch= clip_url['edit_url'])
    clipped.show()
    print("done")

def createaClip():
    keyboard.add_hotkey('Ctrl+Alt+L', clip_creator)
    keyboard.wait()

# COMBINATIONS = [
#     {keyboard.Key.ctrl, keyboard.Key.alt, keyboard.KeyCode(char='h')}
# ]
# def on_press(key):
#     if any([key in COMBO for COMBO in COMBINATIONS]):
#         current.add(key)
#         if any(all(k in current for k in COMBO)for COMBO in COMBINATIONS):
#             clip_creator()
# def on_release(key):
#     if any([key in COMBO for COMBO in COMBINATIONS]):
#         current.remove(key)
# Create and start the thread for keyboard events
import threading

keyboard_thread = threading.Thread(target=createaClip)
keyboard_thread.daemon = True  # Daemonize thread to exit when main thread exits
keyboard_thread.start()

root = Tk()
myButton_1 = Button(root, text="Authorize your Twitch Account", command=gotoAuthorize)
myButton_1.pack()
myButton_2 = Button(root, text="Verify", command=gotoVerify)
myButton_2.pack()
root.mainloop()

async def main():
    loop = asyncio.new_event_loop()                                                                                                                             
    loop.run_until_complete(main())

