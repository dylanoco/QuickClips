import sqlite3
import os
import sys



if getattr(sys, 'frozen', False):
    base_dir = os.path.dirname(sys.executable)
elif __file__:
    base_dir = os.path.dirname(__file__)
db_path = os.path.join(base_dir, 'database', 'keys.db')


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
            print("sqlite connection is closed")

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
        print("SQLite table created: Database")
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
        print("Error while creating a sqlite table clips", error)
    finally:
        if sqliteConnection:
            sqliteConnection.close()
            print("sqlite connection is closed")
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
            print("sqlite connection is closed")

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
            print("sqlite connection is closed")

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
        print("INSERT INSERT INSERT INSERT INSERT INSERT INSERT ")
        insertTokens(auth_t,refr_t,d_name,prof_pic_url,exp_in,hk)

    sqliteConnection.close()
    print("sqlite connection is closed")

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
        return refresh_token[0]

    except sqlite3.Error as error:
        print("Error while creating a sqlite table", error)
        return None
    finally:
        if sqliteConnection:
            sqliteConnection.close()
            print("sqlite connection is closed")

def getAccessToken():
    try:
        sqliteConnection = sqlite3.connect(db_path)
        sqlite_get_auth_token = '''SELECT auth_token FROM AuthKeys WHERE id = 1;'''

        cursor = sqliteConnection.cursor()
        print("Successfully Connected to SQLite")
        cursor.execute(sqlite_get_auth_token)
        auth_token = cursor.fetchone()
        print("SQLite Insert Completed")

        cursor.close()
        return auth_token[0]

    except sqlite3.Error as error:
        print("Error while getting access token: ", error)
        return None
    finally:
        if sqliteConnection:
            sqliteConnection.close()
            print("sqlite connection is closed")

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
        return hotkey[0]

    except sqlite3.Error as error:
        print("Error while getting hotkey: ", error)
        return None
    finally:
        if sqliteConnection:
            sqliteConnection.close()
            print("sqlite connection is closed")

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
            print("sqlite connection is closed")

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
            print("sqlite connection is closed")

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
            print("sqlite connection is closed")

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
            print("sqlite connection is closed")