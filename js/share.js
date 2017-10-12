window.fbAsyncInit = function() {
    FB.init({
        appId            : '164775590768378',
        autoLogAppEvents : true,
        xfbml            : true,
        version          : 'v2.10'
    });
    FB.AppEvents.logPageView();

    document.getElementById('facebook').onclick = function() {
        FB.ui({
            method: 'share',
            display: 'popup',
            href: 'https://deco1800-p1f.uqcloud.net/musicbox.html',
            picture: 'https://deco1800-p1f.uqcloud.net/huijiefan/somi.jpg'
        }, function(response){});
    }
};

(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

!function(d,s,id){
    var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';
    if(!d.getElementById(id)){
        js=d.createElement(s);js.id=id;
        js.src=p+'://platform.twitter.com/widgets.js';
        fjs.parentNode.insertBefore(js,fjs);
    }
}(document, 'script', 'twitter-wjs');

function toggleShare(box){
    var box = document.getElementById(box);

    if(box.dataset.opened =="no"){
        document.getElementById("box").style.display='block';
        box.dataset.opened ="yes";
    }else{
        document.getElementById("box").style.display='none';
        box.dataset.opened ="no";
    }

}