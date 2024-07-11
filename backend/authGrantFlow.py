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
app = Flask(__name__)
#Variables
acc_token = ""
refr_token = ""

def run_flask():
    app.run(port=5000)

def open_browser():
    webbrowser.open_new("http://localhost:5000/")

@app.route('/')
def home():
    return render_template('index.html')
@app.route('/callback')
def callback():
    global auth_cid
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
            return "Authentication successful! Token stored in session."
        else:
            print("Failed to exchange token")
    return "Error during authentication."

load_dotenv()
client_secret = os.getenv('TWITCH_CLIENT_SECRET')
def gotoAuthorize():
    open_browser()



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


