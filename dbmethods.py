import sqlite3
try:
    sqliteConnection = sqlite3.connect('database/keys.db')
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
    try:
        sqliteConnection = sqlite3.connect('database/keys.db')
        sqlite_create_table_query = '''CREATE TABLE IF NOT EXISTS AuthKeys (
                                    id INTEGER PRIMARY KEY,
                                    auth_token TEXT NOT NULL,
                                    refr_token text NOT NULL UNIQUE,
                                    expires_in datetime);'''

        cursor = sqliteConnection.cursor()
        print("Successfully Connected to SQLite")
        cursor.execute(sqlite_create_table_query)
        sqliteConnection.commit()
        print("SQLite table created")

        cursor.close()

    except sqlite3.Error as error:
        print("Error while creating a sqlite table", error)
    finally:
        if sqliteConnection:
            sqliteConnection.close()
            print("sqlite connection is closed")

def importTokens(auth_t,refr_t,exp_in):
    try:
        sqliteConnection = sqlite3.connect('database/keys.db')
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

def getRefreshToken():
    try:
        sqliteConnection = sqlite3.connect('database/keys.db')
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
        sqliteConnection = sqlite3.connect('database/keys.db')
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