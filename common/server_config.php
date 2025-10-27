<?php
function getServerConfig($user, $servers) {
    $ip = [];
    $ser = [];
    
    if ($user == "root") {
        foreach ($servers as $server) {
            $ser[$server] = $server;
            $ip[$server] = exec("nslookup $server | grep Address: | tail -n 1 | awk '{print $2}'");
            $no = "0";
        }
    } else {
        $no = exec("echo $user | cut -c 5-");
        foreach ($servers as $server) {
            $ser[$server] = "u{$no}-$server";
            $ip[$server] = exec("nslookup u{$no}-$server | grep Address: | tail -n 1 | awk '{print $2}'");
        }
    }
    
    return [
        'clientIP' => $ip["client1"],
        'clientHostname' => $ser["client1"],
        'serverHostname' => $ser[$servers[0]],
        'serverIP' => $ip[$servers[0]],
        'gatewayIP' => "10.10.$no.254"
    ];
}
?>

