import sqlite3
try:
    sqliteConnection = sqlite3.connect('backend/database/keys.db')
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
    sqliteConnection = sqlite3.connect('backend/database/keys.db')
    try:
        
        sqlite_create_table_query = '''CREATE TABLE IF NOT EXISTS AuthKeys (
                                    id INTEGER PRIMARY KEY,
                                    auth_token TEXT NOT NULL,
                                    refr_token text NOT NULL UNIQUE,
                                    expires_in datetime);'''

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
                            link text NOT NULL UNIQUE,
                            date datetime);'''

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

def insertTokens(auth_t,refr_t,exp_in):
    try:
        sqliteConnection = sqlite3.connect('backend/database/keys.db')
        sqlite_create_table_query = '''INSERT INTO AuthKeys (id,auth_token,refr_token,expires_in) VALUES (?,?,?,?);'''
        userValues = (1,auth_t,refr_t,exp_in)

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

def updateTokens(auth_t,refr_t,exp_in):
    userValues = (auth_t,refr_t,exp_in)
    sqliteConnection = sqlite3.connect('backend/database/keys.db')
    sqlite_find_row = '''SELECT COUNT(*) from AuthKeys'''
    cursor = sqliteConnection.cursor()
    cursor.execute(sqlite_find_row)
    result = cursor.fetchone()
    row_count = result[0]

    if(row_count > 0):
        
        sqlite_create_table_query = '''UPDATE AuthKeys set auth_token = ?, refr_token = ?, expires_in = ? WHERE id = 1;'''
        cursor = sqliteConnection.cursor()
        print("Successfully Connected to SQLite")
        cursor.execute(sqlite_create_table_query, userValues)
        sqliteConnection.commit()
        print("SQLite Update Completed")
        cursor.close()
    else:
        userValues = (1,auth_t,refr_t,exp_in)
        sqlite_create_table_query = '''INSERT INTO AuthKeys (id,auth_token,refr_token,expires_in) VALUES (?,?,?,?);'''
        cursor = sqliteConnection.cursor()
        print("Successfully Connected to SQLite")
        cursor.execute(sqlite_create_table_query, userValues)
        sqliteConnection.commit()
        print("SQLite Insert Completed")
        cursor.close()

    sqliteConnection.close()
    print("sqlite connection is closed")

def getRefreshToken():
    try:
        sqliteConnection = sqlite3.connect('backend/database/keys.db')
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
        sqliteConnection = sqlite3.connect('backend/database/keys.db')
        sqlite_get_auth_token = '''SELECT auth_token FROM AuthKeys WHERE id = 1;'''

        cursor = sqliteConnection.cursor()
        print("Successfully Connected to SQLite")
        cursor.execute(sqlite_get_auth_token)
        auth_token = cursor.fetchone()
        print("SQLite Insert Completed")

        cursor.close()
        return auth_token[0]

    except sqlite3.Error as error:
        print("Error while creating a sqlite table", error)
        return None
    finally:
        if sqliteConnection:
            sqliteConnection.close()
            print("sqlite connection is closed")

def insertClip(slug,link,date):

    try:
        sqliteConnection = sqlite3.connect('backend/database/keys.db')
        sqlite_create_table_query = '''INSERT INTO Clips (slug,link,date) VALUES (?,?,?);'''
        userValues = (slug,link,date)

        cursor = sqliteConnection.cursor()
        print("Successfully Connected to SQLite")
        cursor.execute(sqlite_create_table_query, userValues)
        sqliteConnection.commit()
        print("SQLite Insert Clip Completed")

        cursor.close()

    except sqlite3.Error as error:
        print("Error while creating a sqlite table", error)
    finally:
        if sqliteConnection:
            sqliteConnection.close()
            print("sqlite connection is closed")

def get_clips():

    try:
        sqliteConnection = sqlite3.connect('backend/database/keys.db')
        sqlite_get_clips= '''SELECT slug FROM Clips'''

        cursor = sqliteConnection.cursor()
        print("Successfully Connected to SQLite")
        cursor.execute(sqlite_get_clips)
        clips = cursor.fetchall()
        print("SQLite Getting Clips Completed")

        cursor.close()
        return clips

    except sqlite3.Error as error:
        print("Error while creating a sqlite table", error)
        return None
    finally:
        if sqliteConnection:
            sqliteConnection.close()
            print("sqlite connection is closed")