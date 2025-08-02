<?php
// Load environment variables from the .env file if it exists.
// In a production environment, you might use a more robust library like dotenv.
// For Docker, the variables are passed directly from docker-compose.yml.
// This local check is for running the file outside of the container.
if (file_exists(__DIR__ . '/.env')) {
    $lines = file(__DIR__ . '/.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) {
            continue;
        }
        list($name, $value) = explode('=', $line, 2);
        putenv(sprintf('%s=%s', $name, $value));
    }
}

// Get the database connection details from environment variables
$host = getenv('DB_HOST');
$port = getenv('DB_PORT');
$dbname = getenv('DB_NAME');
$username = getenv('DB_USER');
$password = getenv('DB_PASSWORD');

// Check if all necessary environment variables are set
if (!$host || !$dbname || !$username || !$password || !$port) {
    die('Error: Database credentials are not set in environment variables.');
}

try {
    // Attempt to connect to the database using PDO
    $db_connect = new PDO("pgsql:host=$host;port=$port;dbname=$dbname", $username, $password);
    
    // Set PDO attributes for better error handling
    $db_connect->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Set the date style for the database session to DMY (Day-Month-Year)
    // This will apply to all scripts that include this file.
    $db_connect->exec("SET datestyle TO 'DMY'");

} catch (PDOException $e) {
    // Handle connection errors gracefully
    die('Error connect to DataBase: ' . $e->getMessage());
}
