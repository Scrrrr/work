<?php
session_start();

function getAuthenticatedUser() {
    if (!isset($_SESSION['username'])) {
        if (isset($_GET['username'])) {
            $_SESSION['username'] = $_GET['username'];
        } else {
            die("usernameパラメータを指定してください。");
        }
    }
    return $_SESSION['username'];
}
?>

