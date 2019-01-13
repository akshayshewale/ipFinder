<?php
    $ip = $_REQUEST["ip"];
    echo "$ip##".gethostbyaddr($ip);
?>
