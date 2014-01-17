<?php
    $dbhost = 'us-cdbr-east-04.cleardb.com';
    $dbuser = 'b01556d5fadf7a';
    $dbpass = '4ac9b1e3';
    $conn = mysql_connect($dbhost, $dbuser, $dbpass);
    
    if(! $conn )
    {
      die('Could not connect: ' . mysql_error());
    }


    //If statement to determine whether or not we want to add
    //a new user or position
    if(array_key_exists("user", $_GET)) {
        //URL info: ID=__&user=__&color=%23__&tracking=__
        $sql = "INSERT
            INTO users (ID, user, color, tracking)
            VALUES ({$_GET['ID']}, {$_GET['user']}, {$_GET['color']}, 1)";
        
        echo $sql;
    }
    else if(array_key_exists("x", $_GET)){
        //URL info: ID=__&user=__&color=%23__&tracking=__
       $sql = "INSERT
            INTO positions (ID, x, y, z)
            VALUES ({$_GET['ID']}, {$_GET['x']}, {$_GET['y']}, {$_GET['z']})"; 
        
        echo $sql;
    }
     
    
    
    mysql_select_db('heroku_357d3113aeb360f');
    $retval = mysql_query( $sql, $conn );

    
    mysql_close($conn);
    ?>
