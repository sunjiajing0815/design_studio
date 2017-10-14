<?php
    include('connect.php');

    $seqno=uniqid();
    $musicrecord=$_POST['music_record'];
    $sql= mysqli_query($conn,"INSERT INTO music_records(id,record) VALUES('".$seqno."','".$musicrecord."')");

?>
