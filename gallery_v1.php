<!doctype html>
<html>

<head>
    <meta charset="utf-8" />
    <title>Gallery</title>
    <link rel="stylesheet" type="text/css" href="./css/gallery.css" />
    <link type="text/css" rel="stylesheet" href="./css/font-awesome.css">
    <link type="text/css" rel="stylesheet" href="./css/share_style.css">

    <script src="js/jquery-1.7.2.min.js"></script>
    <script type="text/javascript" src="js/Gallary.js?v=001"></script>
    <script src="https://use.typekit.net/mfb8wxn.js"></script>
    <script src="https://apis.google.com/js/platform.js" async defer></script>
    <script type="text/javascript" src="js/share.js"></script>
    <script>try{Typekit.load({ async: true });}catch(e){}</script>

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:creator" content="@twinkleffan" />

    <meta property="og:type" content="music.song" />
    <meta property="og:url" content="https://deco1800-p1f.uqcloud.net/gallery_v1.php" />
    <meta property="og:title" content="Music Box" />
    <meta property="og:description" content="Hi, guys! I find an interesting website to recompose classical songs!" />
    <meta property="og:image" content="https://deco1800-p1f.uqcloud.net/huijiefan/img_song.jpg" />
    <meta property="fb:app_id" content="164775590768378" />

    <link href="https://fonts.googleapis.com/css?family=Crete+Round|Lobster+Two" rel="stylesheet">

</head>

<body>
<?php

    //Load data from csv. Filter the data
    $mblist = array(1=>"Australia unfurl the flag!",2=>"When the jacaranda blooms", 3=>"Soldiers of the willow", 4=>"My little Aussie girl", 5=>"Brothers in arms patriotic song", 6=>"Queensland waltz");
    $cache_filename = 'cache/slq-cache.json';

    //check cache
    if(file_exists($cache_filename)) {
        // Cache file exists
        $data = file_get_contents($cache_filename);
        $data = json_decode($data);
    }
    else {
        // Cache file doesn't exist, let's create one
        $file = fopen('./document/tmp93Y8OaNASLA_music.csv','r');
        while ($rawdata = fgetcsv($file)) {
            $data[] = $rawdata;
        }
        file_put_contents($cache_filename, json_encode($data));
        fclose($file);
    }

    //Get filter test from the front end
    $filter = '';
    if(isset($_GET['text']) && $_GET['text'] != '') {
        $filter = $_GET['text'];
    }

    //Process data in a loop. save the data into two lists imagelist and detaillist
    if(is_array($data)) {
        $imagelist='';
        $detaillist='';
        $count=0;
        foreach($data as $arr){
            if ($arr[0]!=""){
                $index = strpos($arr[17], 'http:');
                //echo $index;
                if($index > 0) {
                    $i++;
                    $img = substr($arr[17], $index);
                    $tit = $arr[0];
                    $create = $arr[2];
                    $subject = $arr[3];
                    $des = $arr[4];
                    $tit = str_replace("'","", $tit);
                    if($filter) {
                        if(strpos($tit, $filter) !== FALSE && $tit!=="The Queensland childrens song arranged in four parts for unaccompanied singing.") {
                            $validRecord = true;
                        }
                        else {
                            $validRecord = false;
                        }
                    }
                    else {
                        $validRecord = true;
                    }
                    if($validRecord){
                        //echo '<p><img src='.$img.'><p/>';
                        $imagelist .= "<li data-num='$i' title='$tit'><img class='MB$i' src='$img' alt='$tit' width='200' height='260'></li>";
                        if(array_search($tit,$mblist)===false){
                            $detaillist .= "<div class='item mb$i'>"."<div class=Detail>".'<div class ="Cover" >'.
                                "<img class='first' src='$img' alt='' title='' >".
                                '</div>'.'<div class="Info">'.
                                '<div class="content">'.
                                "<div class='title'><p>$tit</p></div>".
                                '<img class="share" src="img/share.png" alt="" title="" width="40" height="40">'.
                                "<ul><li>Create by $create</li><li>Subject:$subject</li></ul>".
                                "<div class='word'><p>$des</p><p>Sorry, the music box game for this music is not ready yet. Please try another one.</p>".
                                '</div></div>'.
                                '<div class="btns"><div class="back-btn"><img class="back" src="img/back.png" alt="" title="" width="120" height="50"></div></div>'.
                                '</div></div></div>';
                        }else{
                            $mbno = array_search($tit,$mblist);
                            $detaillist .= "<div class='item mb$i'>"."<div class=Detail>".'<div class ="Cover" >'.
                                "<img class='first' src='$img' alt='' title='' >".
                                '</div>'.'<div class="Info">'.
                                '<div class="content">'.
                                "<div class='title'><p>$tit</p></div>".
                                '<img class="share" src="img/share.png" alt="" title="" width="40" height="40">'.
                                "<ul><li>Create by $create</li><li>Subject:$subject</li></ul>".
                                "<div class='word'><p>$des</p><p>Come on have a try of our new music box game for this music, help us correct the error and send us your version of the music!</p>".
                                '</div></div>'.
                                '<div class="btns"><div class="back-btn"><img class="back" src="img/back.png" alt="" title="" width="120" height="50"></div>'.
                                "<a href='musicbox.html?mb_no=$mbno'>".'<img class="play" src="img/play.png" alt="" title="" width="120" height="50"></a></div>'.
                                '</div></div></div>';
                        }
                        $count++;
                    }

                }

            }
        }
    }

?>
<div class="gallary">
    <!--Start of the Navigation bar-->
    <div class= "nav">
        <ul>
            <li><a href="index.html">Home</a></li>
            <li><a href="index.html#musicbox">Music Box</a></li>
            <li><a href="index.html"><img src="img/MusicQueensland.png" alt="" title="" width="15%"/></a></li>
            <li><a href="gallery_v1.php" class="active">Gallery</a></li>
            <li><a href="about.html">About us</a></li>
        </ul>
    </div>
    <!--End of the Navigation bar-->

    <!-- Search Bar modified based on https://webdesign.tutsplus.com/tutorials/css-experiments-with-a-search-form-input-and-button--cms-22069 -->
    <div class="searchbox">
        <div class="container-1">
            <form id="filter" class="">
                <span class="searchicon"><i class="fa fa-search"></i></span>
                <input id="filter-text" name="text" type="text" placeholder="Filter by title" method="get" value="<?php echo $filter; ?>">

            </form>

        </div>
        <p id="filter-count"><strong><?php echo $count; ?></strong> records displayed.</p>
    </div>

    <!--music cover-->
    <div class="MusicBoxList">
        <ul id="imgs">
            <?php
                echo $imagelist;
            ?>
        </ul>

    </div>


    <div class="mb" id="box">
        <?php
            echo $detaillist;
        ?>

    </div>



</div>
<!--share pop up-->
<div id="sharebox" data-opened="no">
    <div class="share-title">
        <h3>Share to Social Media</h3>
    </div>
    <div class="wrapper fb-share">
        <div
                data-href="https://deco1800-p1f.uqcloud.net/gallery_v1.php"
                data-layout="button" data-size="large">
            <a class="fb-xfbml-parse-ignore" target="_blank"
               href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fdeco1800-p1f.uqcloud.net%2Fgallery_v1.php&amp;
                        src=sdkpreparse">
                <div class="icon" id="facebook">
                    f
                </div>
            </a>
        </div>
        <div class="share-name">
            <h4>Facebook</h4>
        </div>
    </div>

    <div class="wrapper tw-share">
        <a href="https://twitter.com/intent/tweet?url=https://deco1800-p1f.uqcloud.net/gallery_v1.php&via=twinkleffan&text=Hi, guys! I find an interesting website to recompose classical songs!">
            <div class="icon" id="twitter">
                t
            </div>
        </a>
        <div class="share-name">
            <h4>Twitter</h4>
        </div>
    </div>

    <div class="wrapper gl-share">
        <!-- <div data-action="share" data-href="https://deco1800-p1f.uqcloud.net/musicbox.html">g</div> -->
        <a href="https://plus.google.com/share?url=https://deco1800-p1f.uqcloud.net/gallery_v1.php"
           onclick="javascript:window.open(this.href,'', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');return false;">
            <div class="icon" id="google">
                G
            </div>
        </a>
        <div class="share-name">
            <h4>Google Plus</h4>
        </div>
    </div>
</div>
<!--End pop up-->
<div class="background">
    <div class="layer">
    </div>
</div>
</body>

</html>