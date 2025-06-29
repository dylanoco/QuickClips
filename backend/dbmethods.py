import sqlite3
import os
import sys
from pathlib import Path

if getattr(sys, 'frozen', False):
    base_dir = os.path.dirname(sys.executable)
elif __file__:
    base_dir = os.path.dirname(__file__)


# If a path is passed in from Electron, use it
if len(sys.argv) > 1:
    db_path = Path(sys.argv[1])
    print(f"Using external DB path from Electron: {db_path}")
else:
    # fallback to old behavior (only if no argument passed)
    if getattr(sys, 'frozen', False):
        base_dir = os.path.dirname(sys.executable)
    elif '__file__' in globals():
        base_dir = os.path.dirname(__file__)
    else:
        base_dir = os.getcwd()
    db_path = Path(base_dir) / 'database' / 'keys.db'
    print(f"⚠️ Using fallback DB path (may reset on update): {db_path}")

# Create directory if needed
db_path.parent.mkdir(parents=True, exist_ok=True)



temp_Path = base_dir + '/database'
isExist = os.path.exists(temp_Path)
if not isExist:
   os.makedirs(temp_Path)
   print("The new directory is created!")
try:
    print(db_path)
    sqliteConnection = sqlite3.connect(db_path)
    cursor = sqliteConnection.cursor()
    print("Database created and Successfully Connected to SQLite")

    sqlite_select_Query = "select sqlite_version();"
    cursor.execute(sqlite_select_Query)
    record = cursor.fetchall()
    print("SQLite Database Version is: ", record)
    cursor.close()

except sqlite3.Error as error:
    print("Error while connecting to sqlite", error)
finally:
        if sqliteConnection:
            sqliteConnection.close()
            print("sqlite connection is closed1")
#Initializing the Database
def initDatabase():
    sqliteConnection = sqlite3.connect(db_path)
    try:
        
        sqlite_create_table_query = '''CREATE TABLE IF NOT EXISTS AuthKeys (
                                    id INTEGER PRIMARY KEY,
                                    auth_token TEXT NOT NULL,
                                    refr_token text NOT NULL UNIQUE,
                                    display_name TEXT NOT NULL,
                                    profile_pic_url TEXT NOT NULL,
                                    expires_in datetime,
                                    hotkey TEXT );'''

        cursor = sqliteConnection.cursor()
        print("Successfully Connected to SQLite")
        cursor.execute(sqlite_create_table_query)
        sqliteConnection.commit()
        print("SQLite table created: AuthKeys")
        cursor.close()

    except sqlite3.Error as error:
        print("Error while creating a sqlite table", error)



    try:
        sqlite_create_table_query_clips = '''CREATE TABLE IF NOT EXISTS Clips (
                            slug TEXT PRIMARY KEY,
                            link text,
                            date datetime,
                            time TEXT,
                            game TEXT);'''

        cursor = sqliteConnection.cursor()
        cursor.execute(sqlite_create_table_query_clips)
        sqliteConnection.commit()
        print("SQLite table created: Clips")

        cursor.close()

    except sqlite3.Error as error:
        print("Error while creating a sqlite table", error)
    finally:
        if sqliteConnection:
            sqliteConnection.close()
            print("sqlite connection is closed2")
#Removing Clips from Database
def remove_clips(slugs):
    try:
        print(slugs)
        sqliteConnection = sqlite3.connect(db_path)
        sqlite_delete_clip = "DELETE FROM Clips WHERE slug = ?"

        cursor = sqliteConnection.cursor()
        print("Successfully Connected to SQLite")
        cursor.execute(sqlite_delete_clip,(slugs,))
        sqliteConnection.commit()
        print("SQLite Delete Completed")

        cursor.close()

    except sqlite3.Error as error:
        print("Error while deleting: ", error)
    finally:
        if sqliteConnection:
            sqliteConnection.close()
            print("sqlite connection is closed3")
#Inserting Tokens if Token does not exist
def insertTokens(auth_t,refr_t,d_name,prof_pic_url,exp_in,hk):
    try:
        sqliteConnection = sqlite3.connect(db_path)
        sqlite_create_table_query = '''INSERT INTO AuthKeys (id,auth_token,refr_token,display_name,profile_pic_url,expires_in,hotkey) VALUES (?,?,?,?,?,?,?);'''
        userValues = (1,auth_t,refr_t,d_name,prof_pic_url,exp_in,hk)

        cursor = sqliteConnection.cursor()
        print("Successfully Connected to SQLite")
        cursor.execute(sqlite_create_table_query, userValues)
        sqliteConnection.commit()
        print("SQLite Insert Completed")
        cursor.close()

    except sqlite3.Error as error:
        print("Error while creating a sqlite table", error)
    finally:
        if sqliteConnection:
            sqliteConnection.close()
            print("sqlite connection is closed4")
#Updating Tokens
def updateTokens(auth_t,refr_t,d_name,prof_pic_url,exp_in,hk):
    userValues = (auth_t,refr_t,d_name,prof_pic_url,exp_in,hk)
    print(userValues)
    sqliteConnection = sqlite3.connect(db_path)
    sqlite_find_row = '''SELECT COUNT(*) from AuthKeys'''
    cursor = sqliteConnection.cursor()
    cursor.execute(sqlite_find_row)
    result = cursor.fetchone()
    row_count = result[0]

    if(row_count > 0):
        sqlite_create_table_query = '''UPDATE AuthKeys set auth_token = ?, refr_token = ?, display_name = ?, profile_pic_url = ?,expires_in = ?, hotkey = ? WHERE id = 1;'''
        cursor = sqliteConnection.cursor()
        print("Successfully Connected to SQLite")
        cursor.execute(sqlite_create_table_query, userValues)
        sqliteConnection.commit()
        print("SQLite Update Completed")
        cursor.close()
    else:
        insertTokens(auth_t,refr_t,d_name,prof_pic_url,exp_in,hk)

    sqliteConnection.close()
    print("sqlite connection is closed5")
#Insert Recently Created Clips
def insertClip(slug,link,date,time,game):
    try:
        sqliteConnection = sqlite3.connect(db_path)
        sqlite_create_table_query = '''INSERT INTO Clips (slug,link,date,time,game) VALUES (?,?,?,?,?);'''
        userValues = (slug,link,date,time,game)

        cursor = sqliteConnection.cursor()
        print("Successfully Connected to SQLite")
        cursor.execute(sqlite_create_table_query, userValues)
        sqliteConnection.commit()
        print("SQLite Insert Clip Completed")

        cursor.close()

    except sqlite3.Error as error:
        print("Error while inserting a clip: ", error)
    finally:
        if sqliteConnection:
            sqliteConnection.close()
            print("sqlite connection is closed6")
#Getter Functions
#Getting Clips
def get_clips():

    try:
        sqliteConnection = sqlite3.connect(db_path)
        sqlite_get_clips= '''SELECT slug, date, time, game FROM Clips'''

        cursor = sqliteConnection.cursor()
        print("Successfully Connected to SQLite")
        cursor.execute(sqlite_get_clips)
        clips = cursor.fetchall()
        print("SQLite Getting Clips Completed")

        cursor.close()
        return clips

    except sqlite3.Error as error:
        print("Error while getting clips: ", error)
        return None
    finally:
        if sqliteConnection:
            sqliteConnection.close()
            print("sqlite connection is closed7")
#Getting the Link of the Clip(s)
def get_link(slug):

    try:
        sqliteConnection = sqlite3.connect(db_path)
        sqlite_get_link= '''SELECT link FROM Clips WHERE slug = ?'''

        cursor = sqliteConnection.cursor()
        print("Successfully Connected to SQLite")
        cursor.execute(sqlite_get_link,(slug,))
        link = cursor.fetchone()
        print(link)
        print("SQLite Getting Clips Completed")

        cursor.close()
        return link

    except sqlite3.Error as error:
        print("Error while getting link(s): ", error)
        return None
    finally:
        if sqliteConnection:
            sqliteConnection.close()
            print("sqlite connection is closed8")
#Getting User Details (Profile Picture, Display Name)
def getUserDetails():
    try:
        sqliteConnection = sqlite3.connect(db_path)
        sqlite_get_link= '''SELECT display_name, profile_pic_url FROM AuthKeys'''

        cursor = sqliteConnection.cursor()
        print("Successfully Connected to SQLite")
        cursor.execute(sqlite_get_link)
        link = cursor.fetchone()
        print(link)
        print("SQLite Getting Details Completed")

        cursor.close()
        return link

    except sqlite3.Error as error:
        print("Error while getting user details: ", error)
        return None
    finally:
        if sqliteConnection:
            sqliteConnection.close()
            print("sqlite connection is closed9")
#Grabbing Refresh Token from Database
def getRefreshToken():
    try:
        sqliteConnection = sqlite3.connect(db_path)
        sqlite_get_refresh_token = '''SELECT refr_token FROM AuthKeys WHERE id = 1;'''

        cursor = sqliteConnection.cursor()
        print("Successfully Connected to SQLite")
        cursor.execute(sqlite_get_refresh_token)
        refresh_token = cursor.fetchone()
        print("SQLite Insert Completed")

        cursor.close()
        if refresh_token is None:
            print("No refresh token found in the database.")
            return None
        return refresh_token[0]

    except sqlite3.Error as error:
        print("Error while creating a sqlite table", error)
        return None
    finally:
        if sqliteConnection:
            sqliteConnection.close()
            print("sqlite connection is closed11")
#Grabbing Access Token from Database
def getAccessToken():
    try:
        sqliteConnection = sqlite3.connect(db_path)
        sqlite_get_auth_token = '''SELECT auth_token FROM AuthKeys WHERE id = 1;'''

        cursor = sqliteConnection.cursor()
        print("Successfully Connected to SQLite")
        cursor.execute(sqlite_get_auth_token)
        auth_token = cursor.fetchone()
        print("SQLite Insert Completed")

        if auth_token is None:
            print("No access token found in the database.")
            return None
        cursor.close()
        return auth_token[0]

    except sqlite3.Error as error:
        print("Error while getting access token: ", error)
        return None
    finally:
        if sqliteConnection:
            sqliteConnection.close()
            print("sqlite connection is closed22")
#Grabbing Hotkey from Database
def getHotkey():
    try:
        sqliteConnection = sqlite3.connect(db_path)
        sqlite_get_auth_token = '''SELECT hotkey FROM AuthKeys WHERE id = 1;'''

        cursor = sqliteConnection.cursor()
        print("Successfully Connected to SQLite")
        cursor.execute(sqlite_get_auth_token)
        hotkey = cursor.fetchone()
        print("SQLite Insert Completed")

        cursor.close()
        if hotkey is None:
            print("No hotkey found in the database.")
            return "CTRL+ALT+H" 
        return hotkey[0]

    except sqlite3.Error as error:
        print("Error while getting hotkey: ", error)
        return None
    finally:
        if sqliteConnection:
            sqliteConnection.close()
            print("sqlite connection is closed33")

#Updating Hotkey
def updateHotkey(hk):
    print("user val" + hk)
    sqliteConnection = sqlite3.connect(db_path)
    sqlite_find_row = '''SELECT COUNT(*) from AuthKeys'''
    cursor = sqliteConnection.cursor()
    cursor.execute(sqlite_find_row)
    result = cursor.fetchone()
    row_count = result[0]

    if(row_count > 0):
        sqlite_create_table_query = '''UPDATE AuthKeys set hotkey = ? WHERE id = 1;'''
        cursor = sqliteConnection.cursor()
        print("Successfully Connected to SQLite")
        cursor.execute(sqlite_create_table_query, (hk,))
        sqliteConnection.commit()
        print("SQLite Update Completed")
        cursor.close()

    sqliteConnection.close()
    print("sqlite connection is closed44")