<?php
    $dbhost = 'localhost:8888';
    $dbuser = 'adam_select';
    $dbpass = 'password';
    $conn = mysql_connect($dbhost, $dbuser, $dbpass);
    
    if(! $conn )
    {
      die('Could not connect: ' . mysql_error());
    }
    $sql = 'Select a.ID, a.color, a.user, b.x, b.y, b.z, b.time_added
            From users a, positions b
            Where a.tracking = 1 and a.ID = b.ID
            Order By b.time_added'; 
    
    mysql_select_db('trackingdb');
    $retval = mysql_query( $sql, $conn );

    if(! $retval )
    {
      die('Could not get data: ' . mysql_error());
    }
    
    $array = [];

    while($row = mysql_fetch_array($retval, MYSQL_ASSOC))
    {
        if(array_key_exists($row["user"], $array)) {
            $array[$row["user"]]["pos"][] = [$row["x"], $row["z"]];
        }
        else {
            $temp = [];
            $temp["ID"] = $row["ID"];
            $temp["user"] = $row["user"];
            $temp["color"] = $row["color"];
            $temp["pos"][] = [$row["x"], $row["z"]];
            $temp["pastPos"][] = [$row["x"], $row["z"]];
            $array[$row["user"]] = $temp;
        } 
    } 
    
    $array = array_values($array);
    foreach ($array as &$value) {
        $c = count($value["pos"]);
        
        unset($value["pastPos"][0]);
        
        for($i = 0; $i < $c; $i++) {
            if($i >= 4){
                $value["pastPos"][] = $value["pos"][$i];
                unset($value["pos"][$i]);
            }
            $value["pastPos"] = array_values($value["pastPos"]);
        }
        unset($value);
    }
    

    //print_r($array);
    echo(json_encode($array));
    mysql_close($conn);
    ?>
