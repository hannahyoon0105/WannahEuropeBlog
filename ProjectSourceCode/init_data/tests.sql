INSERT INTO users (username, password, admin) 
VALUES 
    ('WesAllen01', '$2b$10$eJZUppv4v9r0oSGkTWyuSuiBOFtlZXOSTQdx7C10oBFt38FUKJOta', true),
    ('hannah', '$2b$10$CHVk3ob/GMGtDISadesLeOnlG4LjnH.NygVmbaDQY4zvf98.RUS46', true),
    ('duncan', '$2b$10$i.eCPpWl.qxqjPPdlpdShujDSnP3iTyQ3hZePbyrbs6PU2af/5aAS', false);

INSERT INTO posts (caption, date_created, bingo_id, image_filepath)
VALUES 
    ('This is a test post', '2021-04-01 12:00:00', NULL, '/resources/xina.jpg'),
    ('This is another test post', '2021-04-01 12:00:00', NULL , 'https://www.cu.edu/sites/default/files/2023_cu_home_bldr-chancellor.jpg'),
    ('This is a third test post', '2021-04-01 12:00:00', NULL , 'https://www.cu.edu/sites/default/files/2023_cu_home_bldr-chancellor.jpg');

INSERT INTO likes (post_id, username)
VALUES 
    (1, 'WesAllen01'),
    (1, 'duncan'),
    (2, 'duncan'),
    (2, 'hannah'),
    (3, 'WesAllen01'),
    (3, 'hannah'),
    (3, 'duncan');


INSERT INTO bingo (body, completed)
VALUES 
    ('Get pickpocketed', false),
    ('Get scammed', false),
    ('Evade a scam', false),
    ('Have an ', false),
    ('Get made fun of for our American accent', false),
    ('See a celebrity', false),
    ('Ride a gondola', false),
    ('Get lawst', false),
    ('Cancel plans to take a nap', false),
    ('Have an annoying hostelmate', false),
    ('Meet some new friends', false),
    ('Enjoy an aperitivo', false),
    ('Order in italian successfully', false),
    ('See the Eiffel Tower sparkle', false),
    ('Someone tries to sell us drugs', false),
    ('Something goes unbelievably wrong', false),
    ('Something goes unbelievably right', false),
    ('Decide something is helllaaa overrated', false),
    ('Wait for something longer than a hour and find it is worth it', false),
    ('Struggle to find a public bathroom', false),
    ('Meet someone else from Colorado', false),
    ('It gets unbearably inesapably hot', false),
    ('Misplace something important', false),
    ('Have the best we have ever had in our entire lves', false),
    ('Miss a train station', false);
