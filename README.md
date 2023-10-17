# Sports Track : Application Web de Visualisation de Données Sportives

## Introduction

Développée dans le cadre de la ressource R3.01 : Développement d'applications web, Sports Track est une applicaiton permettant de visualiser et de gérer des données sportives. Cette application s'appuie sur **Node.js** et une base de données **Sqlite3**.

## Fonctionnalités

- **Inscription & Connexion** : Les utilisateurs peuvent créer un compte et se connecter pour accéder à leurs données personnelles.

- **Importation de Données** : Capacité d'importer des fichiers d'activité sportive au format JSON.

- **Visualisation de Données** : Une fois les données importées, les utilisateurs peuvent les visualiser et obtenir des insights sur leurs activités.

## Architecture

Le choix s'est porté sur le modèle **MVC (Modèle-Vue-Contrôleur)** pour sa modularité et sa clarté. Il sépare la logique métier, la présentation et les interactions utilisateur :

- **Modèle** : Utilisation de **Sqlite3** pour la gestion de la base données.

- **Vue** : Présentation des données à l'utilisateur de manière intuitive.

- **Contrôleur** : Gère les interactions utilisateur, comme les redirections vers certaines routes ou la gestion des inscriptions/connexions.
## Dépendances

- Node.js 18.15.0
- NPM 9.6.2
- Express.js 4.16.4
- Sqlite3 3.37.2

## Installation

1. Clonez le dépôt depuis [Sports Track GitHub](URL_DU_REPO). `git clone https://github.com/gabrielpintods/sports_track_js.git`
2. Installez les dépendances avec `npm install`.
4. Lancez l'application avec `npm start`.
5. Accédez à l'application sur : http://localhost:3000
6. Consultez le fichier PDF du dépôt pour visualiser l'application sans l'installer.

**Note** : Assurez-vous d'avoir **Node.js** installé sur votre système avant de commencer l'installation.