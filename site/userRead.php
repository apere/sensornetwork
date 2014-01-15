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



<!-- Example showing how to access things by key instead of index when looping through the data afterwards
    <?php
    $dbhost = 'localhost:3036';
    $dbuser = 'root';
    $dbpass = 'rootpassword';
    $conn = mysql_connect($dbhost, $dbuser, $dbpass);
    if(! $conn )
    {
      die('Could not connect: ' . mysql_error());
    }
    $sql = 'SELECT a.tutorial_id, a.tutorial_author, b.tutorial_count
            FROM tutorials_tbl a, tcount_tbl b
            WHERE a.tutorial_author = b.tutorial_author';
    
    mysql_select_db('TUTORIALS');
    $retval = mysql_query( $sql, $conn );
    if(! $retval )
    {
      die('Could not get data: ' . mysql_error());
    }
    while($row = mysql_fetch_array($retval, MYSQL_ASSOC))
    {
        echo "Author:{$row['tutorial_author']}  <br> ".
             "Count: {$row['tutorial_count']} <br> ".
             "Tutorial ID: {$row['tutorial_id']} <br> ".
             "--------------------------------<br>";
    } 
    echo "Fetched data successfully\n";
    mysql_close($conn);
    ?>
-->