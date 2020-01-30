<?php
//TILLÅT UPPLADDNING AV YTTERLIGARE FILTYPER
function my_myme_types($mime_types){
    $mime_types['mp3'] = 'audio/mpeg3, audio/x-mpeg-3, video/mpeg, video/x-mpeg'; //Adding photoshop files
    return $mime_types;
}
add_filter('upload_mimes', 'my_myme_types', 1, 1);    

//add_shortcode( 'get-slider', 'get_slider' );
function get_slider() {
   return '<section class="sample" data-slidizle>
    <ul class="slider-content" data-slidizle-content>
    <li class="slider-item" style="background-image:url(https://kiiim.se/matbord-test/wp-content/uploads/2019/02/insta.jpg)"> </li>
    <li class="slider-item" style="background-image:url(https://kiiim.se/matbord-test/wp-content/uploads/2019/02/thumb1-1.jpg)"> </li>
        <li class="slider-item" style="background-image:url(https://kiiim.se/matbord-test/wp-content/uploads/2019/02/thumb4-1.jpg)"> </li>
      </ul>
      <header>
      <h2>Jag är en slider</h2>
        <h3>Underrubrik</h3>
      </header>
      <div class="slider-next" data-slidizle-next> <i class="fa fa-arrow-right">--></i> </div>
      <div class="slider-previous" data-slidizle-previous> <i class="fa fa-arrow-left"><--</i> </div>
      <ul class="slider-navigation" data-slidizle-navigation>
        <!-- automatically generated  navigation -->
      </ul>
    </section>';
}

//HÄMTA POST FRÅN URL SHORTCODE
add_shortcode( 'get-my-post', 'get_my_post' );
function get_my_post($atts = [], $content = null, $tag = ''){
    $postID = url_to_postid($atts['url']);
    $content_post = get_post($postID);
    $content = $content_post->post_content;
    $content = apply_filters('the_content', $content);
    $content = str_replace(']]>', ']]&gt;', $content);
    if(!$content){
        return "Couldn't find the wanted post.";     
    }
    return $content;
}

//CONTENT SECTION PART-HTML
add_shortcode( 'aos-wrap', 'aos_wrap' );
function aos_wrap($atts = [], $content = null, $tag = ''){
    $part = $atts['part'];
    if($part === 'start'){
        return '<div class="content-section-part">';
    }else if($part === 'end'){
        return '</div> <!-- hejdå content-section-part -->';
    }else{
        return 'hej';
    }
}

//HÄMTA NYHETER
add_shortcode( 'get-nyheter', 'get_nyheter' );
//ta in slide-nr som argument
//hämta modif-datum för alla poster
//sortera poster efter modif-datum
//returnera rätt post utifrån sortering 

function get_nyheter($atts = [], $content = null, $tag = ''){
    //aktuell slide
    $slide = $atts['slide'];
    
    //global post-var-inställning
    global $post;
    //arg för posts (hämta endast nyheter, sortera efter modifieringsdatum)
    $args = array( 'category_name' => 'nyheter', 'orderby' => 'modified' );
    $thumbArgs = array( 'width' => 50, 'height' => 50 );
    $posts = get_posts( $args );
    
    //börja formulera output
    $res = '<div class="nyheter-container">';
    //gå igenom alla nyhets-poster
    $postCount = 0;
    foreach( $posts as $post ){
        $postCount++;
        setup_postdata($post); 
        //om post-position matchar slide-nr, skriv ut post
        if($slide == $postCount){
            //exit('thisPos='.$thisPos.' postCount='.$postCount);
            $title = get_the_title();
            $titleFormated = strtolower(str_replace(' ', '-', $title));
            $content = get_the_content();
            //$thumbnail = the_post_thumbnail($thumbArgs);
            $thumb = get_the_post_thumbnail_url();
            
            $res .= '<div id="'.$titleFormated.'-post" class="nyheter-post">';
            $res .= '<h3>'.$title.'</h3>';
            //$res .= '<div>'.$thumbnail.'</div>';
            $res .= '<div class="nyheter-img-container"><img src="'.$thumb.'"max-width="100" max-height="100"/></div>';
            $res .= '<p>'.$content.'</p>';
            $res .= '</div> <!-- hejdå nyheter-post -->';
        }
    }
    
    wp_reset_postdata();
    
    $res .= '</div> <!-- hejdå just-nu-container -->';
    return $res;
}

//COPYRIGHT-TAG
add_shortcode( 'get-copyright', 'get_copyright' );
function get_copyright(){
    $nowYear = date("Y");
    return '<p class="copyright">&copy Matilda Bördin '.$nowYear.'</p>';
}

//kalla på script-registrering
add_action( 'wp_enqueue_scripts', 'my_scripts' );
//inkludera stil- och script-filer
function my_scripts() {
    $now = date("Y/m/d").date("h:i:sa"); //för att auto-uppdatera filers versionsnr
    
    
    //screen-check
    //AOS js
    wp_enqueue_script( 'screenCheck', get_stylesheet_directory_uri().'/screenCheck.js'); 
    
    //wp_enqueue_style( 'parent-style', get_template_directory_uri() . '/style.css' );
    
    
    //css reset
    wp_enqueue_style( 'reset', get_stylesheet_directory_uri().'/reset.css', false, '1', 'screen');
    
    //fontawesome css   
    $fontawesome = "https://netdna.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css";
    wp_enqueue_style( 'font-awesome.min', $fontawesome, false, null, 'screen');
    
    //slidizle css
    //$slidizle = get_stylesheet_directory_uri().'/slidizle.custom.css';
    //wp_enqueue_style( 'slidizle.custom', $slidizle, false, $now, 'screen');
    
    //google fonts
    $font = 'https://fonts.googleapis.com/css?family=Alegreya+Sans+SC|Cormorant+SC|Italiana|Julius+Sans+One|Maitree|Marcellus+SC|Tenor+Sans|Thasadith|Playfair+Display|Playfair+Display+SC" rel="stylesheet';
    wp_enqueue_style('font', $font, false, null, 'screen');
    
    
    //AOS css
    wp_enqueue_style('aos-style', get_stylesheet_directory_uri().'/aos/aos-style.css', false, null, 'screen');
    
    //AOS js
    wp_enqueue_script( 'aos-script', 
        get_stylesheet_directory_uri().'/aos/aos-script.js',
            array( 'jquery' ), 
                null); 
    
    //AOS custom css
    wp_enqueue_style('custom-aos-style', get_stylesheet_directory_uri().'/aos/custom-aos-style.css', false, null, 'screen');
    
    
    //AOS custom js
    wp_enqueue_script( 'custom-aos-script', 
        get_stylesheet_directory_uri().'/aos/custom-aos-script.js', 
            array( 'jquery' ), 
                null); 
    
    
    //custom onepager uikit.css
    //$customOnepager = get_stylesheet_directory_uri().'/custom-onepager-uikit.css';
    //wp_enqueue_style( 'custom-onepager-uikit', $customOnepager, false, $now, 'screen');
    
    //custom css
    wp_enqueue_style( 'custom-style', get_stylesheet_directory_uri().'/custom-style.css', false, $now, 'screen');
    
    //js
    //wp_enqueue_script( 'jquery.slidizle', 
      //  get_stylesheet_directory_uri().'/slidizle-master/js/jquery.slidizle.js',
        //    array( 'jquery' ), 
          //      $now); 
    
    //elem-setup-j
    wp_enqueue_script( 'custom-elem-setup', 
        get_stylesheet_directory_uri().'/custom-elem-setup.js', 
            array( 'jquery' ), 
                $now); 
    
    //custom js          
    /*wp_enqueue_script( 'custom-script', 
        get_stylesheet_directory_uri().'/custom-script.js', 
            array( 'jquery' ), 
                $now); */
                
    

    
    
    
    
    

}

?>