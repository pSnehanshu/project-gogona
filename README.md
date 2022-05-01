# Project Gogona

![Lahori Gogona(Musical Instruments of Assam)](https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Lahori_Gogona%28Musical_Instruments_of_Assam%29.jpg/512px-Lahori_Gogona%28Musical_Instruments_of_Assam%29.jpg)

[Jugal Bharali](<https://commons.wikimedia.org/wiki/File:Lahori_Gogona(Musical_Instruments_of_Assam).jpg>), [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0), via Wikimedia Commons

# Installation

- Install Node.js. [Instructions](https://nodejs.org/en/download/)
- Install PostgreSQL database. [Instructions](https://www.postgresql.org/download/)
- Then, create a file called `.env` with the following content. Replace the username and password with what you have set during installation.

```
DATABASE_URL="postgresql://<username>:<password>@localhost:5432/postgres?schema=public"
```

- Afterwards, run these commands

```
npm install
npx prisma db push
npm run dev
```

- Open [localhost:2343](http://localhost:2343) in your browser.
