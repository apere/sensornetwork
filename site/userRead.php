<?php
    $username = "adam_select"; 
    $password = "password";   
    $host = "localhost";
    $database="trackingdb";
    
    $server = mysql_connect($host, $username, $password);
    $connection = mysql_select_db($database, $server);
    
 //change to my query
    $myquery = "
        Select a.ID, a.user, a.color, b.x, b.y, b.z, b.Time_Added
        From users a, positions b
        Where a.tracking = 1 and a.ID = b.ID
        Order By b.time_added DESC 
    ";

    $query = mysql_query($myquery);
    
    if ( ! $query ) {
        echo mysql_error();
        die;
    }
    
    $data = array();
    
    //update from here?
    for ($x = 0; $x < mysql_num_rows($query); $x++) {
        $data[] = mysql_fetch_assoc($query);
    }
    
    echo json_encode($data);     
     
    mysql_close($server);
?>