<!doctype html>
<html>

	<head>
		<meta charset="utf-8" />
		<title>Gallery</title>
		<link rel="stylesheet" type="text/css" href="./css/gallery.css" />
		<script src="js/jquery-1.7.2.min.js"></script>
		<script type="text/javascript" src="js/Gallary.js"></script>
        <script src="https://use.typekit.net/mfb8wxn.js"></script>
        <link type="text/css" rel="stylesheet" href="./css/font-awesome.css">

        <script>try{Typekit.load({ async: true });}catch(e){}</script>


	
	</head>
	
	<body>
		<div class="gallary">
		
			<div class= "nav">
				<div class="nav1">
					<ul>
						<li><a href="index.html">Home</a></li>
						<li><a href="index.html#musicbox">Music Box</a></li>
					</ul>	
				</div>
				<img class="Top" src="img/MusicQueensland.png" alt="" title="" width="15%" height="15%">
				<div class ="nav2">
					<ul class="nav2">
						<li ><a href="Gallery.php">Gallery</a></li>
						<li><a href="about.html">About us</a></li>
					</ul>
				</div>
			</div>
			
			<div class="MusicBoxList">
				<ul id="imgs">
				<?php 
					$file = fopen('./document/tmp93Y8OaNASLA_music.csv','r');
					while ($data = fgetcsv($file)) { 
					$goods_list[] = $data;
					 }
					//print_r($goods_list);
					 $i = 0;
					 foreach ($goods_list as $arr){
					    if ($arr[0]!=""){
					    	$index = strpos($arr[17], 'http:');
					    	//echo $index;
					    	if($index > 0) {
					    		$i++;
					    		$img = substr($arr[17], $index);
					        	//echo '<p><img src='.$img.'><p/>';
					        	echo "<li data-num='$i'><img class='MB$i' src='$img' alt='' width='200' height='260'></li>";
					    	}
					    	
					    }
					} 
					 
					 fclose($file);
				?>

				</ul>
				
			</div>

			
			<div class="mb" id="box">

				<?php
                    //'http://data.gov.au/storage/f/2013-05-12T204412/tmp93Y8OaNASLA_music.csv'
					$file = fopen('./document/tmp93Y8OaNASLA_music.csv','r');
                    $mblist = array(1=>"Australia unfurl the flag!",2=>"When the jacaranda blooms", 3=>"Soldiers of the willow", 4=>"My little Aussie girl", 5=>"Brothers in arms patriotic song", 6=>"Queensland waltz");
					while ($data = fgetcsv($file)) { 
					$goods_list[] = $data;
					 }
					//print_r($goods_list);
					 $i = 0;
					 $str = '';
					 foreach ($goods_list as $arr){
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
					        	//echo '<p><img src='.$img.'><p/>';

								if(array_search($tit,$mblist)===false){
								    $str = "<div class='item mb$i'>"."<div class=Detail>".'<div class ="Cover" >'.
                                        "<img class='first' src='$img' alt='' title='' >".
                                        '</div>'.'<div class="Info">'.
                                        '<div class="content">'.
                                        "<div class='title'><p>$tit</p></div>".
                                        '<img class="share" src="img/share.png" alt="" title=""" width="40" height="40">'.
                                        "<ul><li>Create by $create</li><li>Subject:$subject</li></ul>".
                                        "<div class='word'><p>$des</p>".
                                        '</div></div>'.
                                        '<div class="btns"><a href="Gallery.php"><img class="back" src="img/back.png" alt="" title="" width="120" height="50"></a></div>'.
                                        '</div></div></div>';
                                }else{
								    $mbno = array_search($tit,$mblist);
                                    $str = "<div class='item mb$i'>"."<div class=Detail>".'<div class ="Cover" >'.
                                        "<img class='first' src='$img' alt='' title='' >".
                                        '</div>'.'<div class="Info">'.
                                        '<div class="content">'.
                                        "<div class='title'><p>$tit</p></div>".
                                        '<img class="share" src="img/share.png" alt="" title=""" width="40" height="40">'.
                                        "<ul><li>Create by $create</li><li>Subject:$subject</li></ul>".
                                        "<div class='word'><p>$des</p>".
                                        '</div></div>'.
                                        '<div class="btns"><a href="Gallery.php"><img class="back" src="img/back.png" alt="" title="" width="120" height="50"></a>'.
                                        "<a href='musicbox.html?mb_no=$mbno'>".'<img class="play" src="img/play.png" alt="" title="" width="120" height="50"></a></div>'.
                                        '</div></div></div>';
                                }
                                echo $str;

					    	}
					    	
					    }
					} 
					 
					 fclose($file);
				?>


				
			</div>
		
			
			
		</div>
	</body>

</html>