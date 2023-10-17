-- noinspection SqlNoDataSourceInspectionForFile

DELETE FROM User;
DELETE FROM Activity;
DELETE FROM Data;

-- Insertion d'un utilisateur standard
INSERT INTO User(email, firstName, lastName, sexe, height, weight, age, birthdate, pswd)
VALUES ('john.doe@example.com', 'John', 'Doe', 'homme', 175.5, 68.5, 30, '10/10/1992', 'password123');

-- Insertion d'une activité pour cet utilisateur
INSERT INTO Activity(desc, date, theUser)
VALUES ('Running in the park', '25/09/2023', 1);

-- Insertion de données pour cette activité
INSERT INTO Data(time, cardioFrequency, latitude, longitude, altitude, theActivity)
VALUES ('00:10:00', 75, 48.8566, 2.3522, 35.0, 1);

-- Insertion avec le poids et la taille minimaux
INSERT INTO User(email, firstName, lastName, sexe, height, weight, age, birthdate, pswd)
VALUES ('small.person@example.com', 'Small', 'Person', 'femme', 0.1, 0.1, 0, '01/01/2023', 'password123');

-- Insertion de données avec cardio minimaux
INSERT INTO Data(time, cardioFrequency, latitude, longitude, altitude, theActivity)
VALUES ('00:01:00', 0, 48.8566, 2.3522, 0.0, 1);

-- Cas d'erreur, test de contraines

-- Table 'User'

-- Échec : Format de l'email incorrect
INSERT INTO User (email, firstName, lastName, sexe, height, weight, age, birthdate, pswd)
VALUES ('incorrectemail', 'John', 'Doe', 'homme', 175, 70, 25, '15/04/1996', 'password123');

-- Échec : Valeur de sexe incorrecte
INSERT INTO User (email, firstName, lastName, sexe, height, weight, age, birthdate, pswd)
VALUES ('john.doe@example.com', 'John', 'Doe', 'alien', 175, 70, 25, '15/04/1996', 'password123');

-- Échec : Hauteur négative
INSERT INTO User (email, firstName, lastName, sexe, height, weight, age, birthdate, pswd)
VALUES ('john.doe@example.com', 'John', 'Doe', 'homme', -175, 70, 25, '15/04/1996', 'password123');

-- Échec : Format de la date de naissance incorrect
INSERT INTO User (email, firstName, lastName, sexe, height, weight, age, birthdate, pswd)
VALUES ('john.doe@example.com', 'John', 'Doe', 'homme', 175, 70, 25, '15-04-1996', 'password123');

-- Échec : Mot de passe trop court
INSERT INTO User (email, firstName, lastName, sexe, height, weight, age, birthdate, pswd)
VALUES ('john.doe@example.com', 'John', 'Doe', 'homme', 175, 70, 25, '15/04/1996', 'pass');

-- Table 'Activity'

-- Échec : Format de la date incorrect
INSERT INTO Activity (desc, date, theUser) VALUES ('Running', '15-04-2023', 1);

-- Table 'Data'

-- Échec : Format du temps incorrect
INSERT INTO Data (time, cardioFrequency, latitude, longitude, altitude, theActivity)
VALUES ('15:04', 80, 40.7128, -74.0060, 10, 1);

-- Échec : Fréquence cardiaque négative
INSERT INTO Data (time, cardioFrequency, latitude, longitude, altitude, theActivity)
VALUES ('15:04:00', -80, 40.7128, -74.0060, 10, 1);


DELETE FROM User;
DELETE FROM Activity;
DELETE FROM Data;