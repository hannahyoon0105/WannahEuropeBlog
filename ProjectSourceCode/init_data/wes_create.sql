DROP TABLE IF EXISTS users;
CREATE TABLE users (
    username VARCHAR(50) PRIMARY KEY,
    password VARCHAR(60) NOT NULL
    -- you guys had password as char and idk why
);

DROP TABLE IF EXISTS posts;
CREATE TABLE posts (
    post_id SERIAL PRIMARY KEY,
    caption VARCHAR(200),
    date_created TIMESTAMP WITH TIME ZONE NOT NULL
    -- not sure if timezone info necessary, but can always change later
);

DROP TABLE IF EXISTS comments;
CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL REFERENCES posts(post_id),
    username VARCHAR(50) NOT NULL REFERENCES users(username),
    body TEXT NOT NULL,
    date_created TIMESTAMP WITH TIME ZONE NOT NULL
);



