jQuery( document ).ready( function( $ ) {
    //PRE-LOADER
    $('.smart-page-loader').append('<div id="preloader-img-container"><img id="preloader-img" src="https://matildabordin.se/wp-content/uploads/2019/02/porträtt-1-preloader.png"/></div>');
    $('#preloader-img').addClass('anim-appear-slow');
    
    var winW, winH, 
        winScroll = $(window).scrollTop(), 
        elemsDone = false, siteIsReady = false, setupBusy = true,
        nyheterOffset,
        rorligtOffset,
        isMobile = window.mobilecheck(),
        isMobileOrTablet = window.mobileAndTabletcheck();
    if(isMobileOrTablet && !isMobile){
        var isTablet = true,
            currDevice = 'tablet';
    }else if(isMobile){
        isTablet = false,
            currDevice = 'mobile';
    }else{
        currDevice = 'desktop'
    }
    //aktuell enhet som används
    console.log('Current device type: '+currDevice);
    
    $('head meta').each(function(){
        if($(this).attr('name') == 'viewport'){
            $(this).attr('content','width=device-width, initial-scale=1.0, viewport-fit=cover, maximum-scale=1, user-scalable=no')
                .attr('id','meta-viewport');
        }
    });
    
    $(window).load(function(){
        setupBusy = true;
        ajustSizes();
        updateNavOpacity();
        awaitPreloader();
    });
    $(window).resize(function(){
        if(!setupBusy){
            setupBusy = true;
            console.log('NOT LISTENING ON WIN RESIZE.');
            setTimeout(function(){
                winW = $(window).innerWidth(),
                winH = $(window).innerHeight();
                ajustSizes();
                //refreshAOS();
                setupBusy = false;     
                console.log('NOW LISTENING ON WIN-RESIZE AGAIN.');
            },1000);
        }
    });
    
    
    $(window).scroll(function(){
        winScroll = $(window).scrollTop();
        if(winScroll < 800){
            updateNavOpacity();
            if(!beforeOmBusy){
                beforeOmBusy = true;
                animBeforeOm();
            }
        }
        if(!setupBusy){
            setupBusy = true;
            setTimeout(function(){
                animNyheterNav();
                animRorligtNav();
                //refreshAOS();
                setupBusy = false;
            }, 3000);
        }
    });

    function ajustSizes(){
        winW = $(window).innerWidth(),
        winH = $(window).innerHeight();
        updateSliderSize();
        setHeaderSliderImgs();
        beforeOmSetup();
        //beforeNyheter();
        nyheterNav();
        rorligtNav();
        //beforeBilder();
        beforeKontakt();
        updateThumbs();
    }
    
    function awaitPreloader(){
        var interval = setInterval(function(){
            var display = $('.smart-page-loader').first().css('display');
            if(display === 'none'){
                clearInterval(interval);
                siteReady();
            }
        }, 500);
    }
    
    //SITER READY!
    function siteReady(){
        siteIsReady = true;
        console.log('SITE READY!');
        $('#preloader-img').removeClass('anim-appear-slow');
        setTimeout(function(){
            $('#site-subtitle').addClass('anim-appear-spacing');    
        },500);
        
        console.log('animating site-subtitle now...');
        setupBusy = false;
        animBeforeOm();
    }
    
    //NAVBAR OPACITY VID SCROLL
    var navOpacity = 1,
        titleOpacity = 1;
    var fixedBar = false;
    var barPos;
    //var bilderOffset = ($("#album-btn-container").offset().top).toFixed(0);
    var bilderBar = $('#album-btn-container').html();
    function updateNavOpacity(){
        //AOS.refresh();
        //fadea nav-bar
            //upp till 25, full opacity
            if(winScroll <= 70){
                navOpacity = 1,
                titleOpacity = 1;
            //vid full nav-vy, fadea till 160
            }else if(winW >= 960 && winScroll < 160){
                navOpacity = (1-(winScroll-25)/1000).toFixed(2); 
            //vid collapsed nav, fadea upp till 800
            }else if(winW < 960 && winScroll < 800){
                if(winScroll < 160){
                    navOpacity = (1-(winScroll-25)/1000).toFixed(2); 
                }
                if(winScroll < 100){
                    titleOpacity = (navOpacity*.9).toFixed(2);
                }else if(winScroll < 200){
                    titleOpacity = (navOpacity*.8).toFixed(2);
                }else if(winScroll < 300){
                    titleOpacity = (navOpacity*.6).toFixed(2);
                }else if(winScroll < 400){
                    titleOpacity = (navOpacity*.4).toFixed(2);
                }else if(winScroll < 500){
                    titleOpacity = (navOpacity*.2).toFixed(2);
                }else if(winScroll < 600){
                    titleOpacity = (navOpacity*.1).toFixed(2);
                }else if(winScroll < 700){
                    titleOpacity = (navOpacity*.05).toFixed(2);
                }else{
                    titleOpacity = 0;
                }

                if(titleOpacity < 0){
                    titleOpacity = 0;
                }
                console.log('title-opacity = '+titleOpacity);
                //$('#site-title').css('filter','opacity(.01)');
            }
        $('#nav').css('filter','opacity('+navOpacity+')');
        $('#site-title').css('filter','opacity('+titleOpacity+')');
        //console.log('Nav-opacity updated.');
    }

    
    var beforeOmHidden = false,
        beforeOmBusy = false;
    function animBeforeOm(){
        $('#before-om-icon').addClass('anim-pulse-fast');
        //var currH = $('#before-om').outerHeight();
        if(winH / winW > .62){
            if(beforeOmBusy){
                if(winScroll <= 15 && beforeOmHidden){

                    $('#before-om-icon').addClass('anim-pulse-fast');

                    //$('#before-om-link-container').css('display','block');
                    $('#before-om-link-container').animate({
                        height: '30px',
                        opacity: 1
                    }, 250, function() {
                        beforeOmHidden = false,
                        beforeOmBusy = false;
                    });

                }else if(winScroll > 15 && !beforeOmHidden){
                    $('#before-om-link-container').animate({
                        height: '0px',
                        opacity: 0
                    }, 600, function() {
                        //$('#before-om-link-container').css('display','none');
                        beforeOmHidden = true,
                        beforeOmBusy = false;  
                        $('#before-om-icon').removeClass('anim-pulse-fast');
                    });
                }else{
                    beforeOmBusy = false;
                }
            }
        }else{
            beforeOmHidden = true;
            $('#before-om').css('opacity',0); 
        }
    }
    
    //ANIM NYHETER-NAV
    function animNyheterNav(){
        nyheterOffset = $('#nyheter .section-title').offset().top.toFixed(0);
        //console.log('nyheter offset='+nyheterOffset+'px and winscroll is'+winScroll);
        if(winScroll > nyheterOffset-400 && winScroll < nyheterOffset){
            console.log('seeing nyheter');
            $('#nyheter .nyheter-nav').removeClass('nyheter-nav-anim');    
            $('#nyheter .nyheter-nav').addClass('nyheter-nav-anim');
        }else{
            $('#nyheter .nyheter-nav').removeClass('nyheter-nav-anim');
        }
    }
    
    
    //REFRESH AOS
    function refreshAOS(){
        AOS.refresh();
        //$(this).attr('data-aos-offset','80');
        if(winH / winW < .55){
            $('.content-section-part').each(function(){ 
                $(this).attr('data-aos-offset','100');
            });
        }
        if($(this).attr('id') === 'nyheter-container'){
             $(this).attr('data-aos-offset','-150');
        }
        console.log('Refreshed AOS.');
    }
    
    //ELEMS
    //#page
    $('.op-sections').first().attr('id','page');
    
    //SECTIONS
    var sectionSize = $('#page section').size(),
        sectionCount = 0,
        thisId;
    $('#page > section').each(function(){
        sectionCount++;
        //console.log('section '+$(this).attr('id'));
        //hämta elem-heights
        var sectionH = $(this).outerHeight(),
            content = $(this).children().first(),
            contentH = $(content).outerHeight();
        //before-sektioner
        thisId = $(this).attr('id');
        if(thisId.indexOf('before-') >= 0){
            $(this).addClass('before-section')
                .attr('uk-parallax','bgy: -100');
        }else{
        //content-sektioner
            $(this).addClass('content-section');
            //var animDir;
            if($(this).attr('id') !== 'kontakt'){ 
                
            }
        }
        if(sectionCount >= sectionSize){
            console.log('SECTION-IDs DONE.');
        }
    });
    
 
    
    //SECTION PART CONTAINERS
    var idCount = 1, 
        currTag = '',
        sectionPartSize = $('section .content-section-part').size(),
        sectionPartCount = 0;
    $('section .content-section-part').each(function(){
        sectionPartCount++;
        //console.log($(this).attr('class'));
        var faderId = $(this).parents('.content-section, .before-section').attr('id'),
            tagAlias = $(this).prop('tagName');
        //console.log(' YEAH fader='+faderId);
        $(this).attr('id',faderId+'-container')
            .addClass('section-content-container');
        if(sectionPartCount >= sectionPartSize){
            console.log('SECTION PARTS DONE.');
        }
    });

    //RUBRIKER
    var h2Size = $('.content-section h2').size(),
        h2Count = 0;
    $('.content-section h2').each(function(){
        h2Count++;
        $(this).addClass('section-title');
        if(h2Count >= h2Size){
            console.log('H2:s DONE.');
        }
    });
    //UNDERRUBRIKER
    var h3Size = $('.content-section h3').size(),
        h3Count = 0;
    $('.content-section h3').each(function(){
        h3Count++;
        $(this).addClass('section-subtitle');
        if(h3Count >= h3Size){
            console.log('H3:s DONE.');
        }
    });
    //BRÖDTEXT
    var txt = $('.content-section p, .content-section td, #cv li, #kontakt .happyforms-part-wrap span, #bilder p.description.section'),
        txtSize = txt.size(),
        txtCount = 0;
    $(txt).each(function(){
        txtCount++;
        $(this).addClass('section-txt');
        if(txtCount >= txtSize){
            console.log('TXT:s DONE.');
        }
    });
    
    /*
    //AOS-klasser
    $('#page').wrap('<div id="transcroller-body" class="aos-all"></div>');
    
    var aosElemsSize = $('.content-section-part').size(),
        aosElemsCount = 0;
    $('.content-section-part').each(function(){
        aosElemsCount++;
        $(this).wrap('<div class="aos-item aos-init aos-animate content-section-part-wrapper"></div>')
        .addClass('aos-item__inner');     
        
        $(this).attr('data-aos','zoom-out');
        $(this).attr('data-aos-offset','80');
        var parentID = $(this).parents('.content-section').attr('id');
        if($(this).attr('id') === 'nyheter-container'){
             //$(this).attr('data-aos-offset','-100');
        }
        if(aosElemsCount >= aosElemsSize){
            console.log('AOS ELEMS DONE.');
        }
    });*/
    
    //NAV
    //huvudrubrik
    $('#nav .uk-navbar-left')
        .html('<a title="site-title-link" id="site-title-link" href="#header-slider"><h1 id="site-title">MATILDA &nbsp; BÖRDIN</h1></a>');
    
    //logga
    $('#nav .uk-logo img').attr('id', 'site-logo'); 
    $('#nav .uk-logo').attr('id','site-logo-link').attr('href','#header-slider');
    $('#nav li a').addClass('nav-link');
    //underrubrik (över slider)
    $('#header-slider').append('<div id="site-subtitle-container"><h2 id="site-subtitle">SKÅDESPELARE &amp; MIMARE</h2></div>');
    console.log('NAV DONE.');
    
    //HIDDEN NAV
    $('#offcanvas-nav ul').attr('id','hidden-nav-ul');
    $('#offcanvas-nav li').addClass('hidden-nav-li');
    var hiddenNavSize = $('#offcanvas-nav a').size(),
        hiddenNavCount = 0;
    $('#offcanvas-nav a').each(function(){
        hiddenNavCount++;
        //console.log($(this).attr('title'));
        $(this).addClass('hidden-nav-link')
            .attr('id', 'hidden-nav-link-'+( $(this).html() ).replace(' ','-'));
        var caps = $(this).text().toUpperCase();
        $(this).text(caps);
        if(hiddenNavCount >= hiddenNavSize){
            console.log('HIDDEN NAV DONE.');
        }
    });
    
    
    //HEADER-SLIDER ID
    $('#header-slider .uk-slidenav-previous svg').attr('id','header-slider-prev');
    $('#header-slider .uk-slidenav-previous').attr('id','header-slider-prev-link');
    $('#header-slider .uk-slidenav-next svg').attr('id','header-slider-next');
    $('#header-slider .uk-slidenav-next').attr('id','header-slider-next-link');
    var sliderCount = 0,
        sliderSize = $('#header-slider img').size();
    $('#header-slider img').each(function(){
        sliderCount++;
        $(this).attr('id','slider-img-'+sliderCount);
        if(sliderCount >= sliderSize){
            console.log('HEADER SLIDER IDs DONE.');
        }
    }); 
    
    //HEADER SLIDER SIZE
    function updateSliderSize(){
        //om header-bild ej räcker ner till botten
        if(winH / winW > .62){
            //sätt sliderheight till full höjd minus navbar+30px
            var sliderH = (winH-110)+'px';
            console.log('winH='+winH+' sliderH='+sliderH);
            $('#header-slider')
                .css('height',sliderH)
                .css('min-height',sliderH)
                .css('max-height',sliderH);
            //$('#header-slider .uk-slideshow')
                //.css('min-height',sliderH);
            $('#header-slider .uk-slideshow-items').css('height',sliderH);
            //$('#before-om').css('background','#ededed');
        }else{
            //$('#before-om').css('background','none');
        }
        console.log('HEADER SLIDER SIZE SET.');
    }
    
    //SET HEADER-SLIDER IMGS (SIZES)
    var smallHeader = false;
    function setHeaderSliderImgs(){
        console.log('winW: '+winW);
        if(winW <= 414 && !smallHeader){
            smallHeader = true;
            $('#slider-img-1').attr('src','https://matildabordin.se/wp-content/uploads/2019/03/slider_img1_lessthan400_2.jpg');
            $('#slider-img-2').attr('src','https://matildabordin.se/wp-content/uploads/2019/03/slider_img2_400.jpg');
            $('#slider-img-3').attr('src','https://matildabordin.se/wp-content/uploads/2019/03/slider_img3_400.jpg');
            console.log('Showing small versions of header imgs');
        }else if(winW > 414 && smallHeader){
            smallHeader = false;
            $('#slider-img-1').attr('src','https://matildabordin.se/wp-content/uploads/2019/02/slider_img1.jpg');
            $('#slider-img-2').attr('src','https://matildabordin.se/wp-content/uploads/2019/02/slider_img2.jpg');
            $('#slider-img-3').attr('src','https://matildabordin.se/wp-content/uploads/2019/02/slider_img3.jpg');
            console.log('Showing big versions of header imgs');
        }
    }
  
    //BEFORE OM
    function beforeOmSetup(){
        $('#before-om').html('<div id="before-om-link-container"><a href="#om" id="before-om-link"><i id="before-om-icon" class="fa fa-chevron-down" aria-hidden="true"></i></a></div>');
        console.log('BEFORE OM DONE.');
    }
        
    /*
    $(window).scroll(function(){
        var bgPos = $('#before-nyheter').css('background-position-y').slice(0, -2);
        console.log('orig bg-pos ==== '+bgPos);
        $('#before-nyheter').css('background-position-y',(bgPos*1+300.00)+'px');
        console.log('new bg-pos ==== '+(bgPos*1+300));
    });*/
    //BEFORE NYHETER
    /*
    var break1first = true;
    function beforeNyheter(){
        if(winW >= 680){ //large
            $('#before-nyheter').css('background-image','url("https://matildabordin.se/wp-content/uploads/2019/02/break_img1_large.png")')
            .attr('data-src','https://matildabordin.se/wp-content/uploads/2019/02/break_img1_large.png');  
        }else if(winW > 400){ //medium
            $('#before-nyheter').css('background-image','url("https://matildabordin.se/wp-content/uploads/2019/02/break_img1_medium.png")')
            .attr('data-src','https://matildabordin.se/wp-content/uploads/2019/02/break_img1_medium.png');  
        }else{ //small
            if(!break1first){
                $('#before-nyheter').css('background-image','url("https://matildabordin.se/wp-content/uploads/2019/02/break_img1_small.png")')
                .attr('data-src','https://matildabordin.se/wp-content/uploads/2019/02/break_img1_small.png');
            }
        }
        break1first = false;
        console.log('BEFORE NYHETER-IMG SET/UPDATED');
    }*/
    
    /*
    //NYHETER, TA BORT TOMMA SLIDES
    var totalNyheter = $('#nyheter .sa_hover_container').size(),
        deletedNyheter = 0,
        nyheterCount = 0;
    $('#nyheter .sa_hover_container').each(function(){
        nyheterCount++;
        var material = $(this).children('.nyheter-container').html();
        if(material === ''){
            deletedNyheter++;
            $(this).remove();
        }
        if(nyheterCount >= totalNyheter){
            console.log('We got '+(totalNyheter-deletedNyheter)+' nyheter (removed '+deletedNyheter+' of '+totalNyheter+').');
        }
    });
    */
    
    //NYHETER
     function nyheterNav(){
        setTimeout(function(){
            if($('#nyheter_slider .owl-nav button').size() !== 2){
                nyheterNav();
            }
            $('#nyheter_slider .owl-nav button').each(function(){
                if($(this).attr('class') === 'owl-prev'){
                    $(this).attr('id','nyheter-prev');
                }else if($(this).attr('class') === 'owl-next'){
                    $(this).attr('id','nyheter-next');     
                }
                $('#nyheter-prev').removeClass('owl-prev')
                    .addClass('nyheter-nav')
                    .html('<i class="fa fa-angle-left" aria-hidden="true"></i>');
                $('#nyheter-next').removeClass('owl-next')
                    .addClass('nyheter-nav')
                    .html('<i class="fa fa-angle-right" aria-hidden="true"></i>');
            });    
            console.log('NYHETER DONE.');
            //för att animera nyheter-navs
            nyheterOffset = $('#nyheter .section-title').offset().top.toFixed(0);
            animNyheterNav();
        },1000);
    }
    
    /*
    //BEFORE BILDER
    var break2first = true;
    function beforeBilder(){
        if(winW >= 1200){ //large
            $('#before-bilder').css('background-image','url("https://matildabordin.se/wp-content/uploads/2019/02/break_img2_large.png")')
            .attr('data-src','https://matildabordin.se/wp-content/uploads/2019/02/break_img2_large.png');  
        }else if(winW >= 600){ //medium
            $('#before-bilder').css('background-image','url("https://matildabordin.se/wp-content/uploads/2019/02/break_img2_medium.png")')
            .attr('data-src','https://matildabordin.se/wp-content/uploads/2019/02/break_img2_medium.png');  
        }else{ //small
            if(!break2first){   
                $('#before-bilder').css('background-image','url("https://matildabordin.se/wp-content/uploads/2019/02/break_img2_small.png")')
                .attr('data-src','https://matildabordin.se/wp-content/uploads/2019/02/break_img2_small.png');
            }
        }
        break2first = false;
        console.log('BEFORE BILDER-IMG SET/UPDATED');
    }*/
    
    //BILDER
    var picCount = 0,
        picSize = $('#bilder img.pic').size();
    $('#bilder img.pic').each(function(){
        picCount++;
        $(this).attr('id','bilder-pic-'+picCount);

        if(picCount >= picSize){
            console.log('found '+picSize+' pics, ajusting top-pos...');
            //picPosTop();    
        }
    });
    
    //TOP-POSITION 0px FÖR THUMBNAILS
    function updateThumbs(){
        console.log('STARTING THUMB FUNCTION');
        var thumbSize = $('#bilder img.pic').size(),
            thumbCount = 0;
        $('#bilder img.pic').each(function(){
            thumbCount++;
            //console.log('thumCount='+thumbCount+' thumbSize='+thumbSize);
            var busy = [$(this).attr('id'), 'false'];
            //console.log('busy[0]='+busy[0]+' busy[1]='+busy[1]); 
            if($(this).css('top') !== '0px'){
                $(this).animate({
                    top: '0px'
                }, 1000, function() {
                    if(thumbCount >= thumbSize){
                        //
                    }
                });
            }
        });
        console.log('THUMBNAILS DONE.');
        rorligtItems();
    }

    //BILD-TXT
    //byt klass
    $('.modula .description').removeClass('description')
        .addClass('bild-txt');
    //ta bort binde-streck i bild-txt
    var bildTxtSize = $('#bilder .item .bild-txt').size(),
        bildTxtCount = 0;
    $('#bilder .item .bild-txt').each(function(){
        bildTxtCount++;
        var bildTxt = $(this).text();
        var bildTxtFormaterad = bildTxt.replace(/ - /g, '<br/>');
        $(this).html(bildTxtFormaterad);
        if(bildTxtCount >= bildTxtSize){
            console.log('BILD-TEXTER DONE.');
        }
    });
    
    //RÖSTPROV KNAPP-FÄRGER
    /*
    var colorVal = 0,
        playColor = 'rgb(0, 0, 0)',
        playCount = 0,
        playSize = $('#rostprov').find('div.karma-by-kadar__simple-player__play .material-icons').size();
    $('#rostprov').find('div.karma-by-kadar__simple-player__play .material-icons').each(function(){
        playCount++;
        
        
        $(this).attr('id','playBtn-'+playCount)
            .addClass('playBtn');
        if(playCount >= playSize){
            playCount = 0;
            colorPlays();
        }
    });
    
    function colorPlays(){
        $('.playBtn').each(function(){
            playColor = 'rgb('+colorVal+','+colorVal+','+colorVal+')';
            console.log('COLOR VAL '+colorVal+' PLAYCOLOR = '+playColor);
            //console.log('PLAY BTN:'+$(this).attr('id'));
            $(this).css('color',playColor);
            colorVal += 40;
            if(colorVal >= 200){
                colorVal = 0;
            }
        });
    }*/

    //RÖRLIGT
    function rorligtNav(){
        setTimeout(function(){
            if($('#rorligt_slider .owl-nav button').size() !== 2){
                rorligtNav();
            }
            $('#rorligt_slider .owl-nav button').each(function(){
                if($(this).attr('class') === 'owl-prev'){
                    $(this).attr('id','rorligt-prev');
                }else if($(this).attr('class') === 'owl-next'){
                    $(this).attr('id','rorligt-next');     
                }
                $('#rorligt-prev').removeClass('owl-prev')
                    .addClass('rorligt-nav')
                    .html('<i class="fa fa-angle-left" aria-hidden="true"></i>');
                $('#rorligt-next').removeClass('owl-next')
                    .addClass('rorligt-nav')
                    .html('<i class="fa fa-angle-right" aria-hidden="true"></i>');
            });
            rorligtOffset = $('#rorligt .section-title').offset().top.toFixed(0);
            animRorligtNav();
        },1000);
    }
    
    //ANIM RÖRLIGT-NAV
    function animRorligtNav(){
        rorligtOffset = $('#rorligt .section-title').offset().top.toFixed(0);
        //console.log('rorligt offset='+rorligtOffset+'px and winscroll is'+winScroll);
        if(winScroll > rorligtOffset-400 && winScroll < rorligtOffset){
            console.log('seeing rörligt');
            $('#rorligt .rorligt-nav').removeClass('nyheter-nav-anim');    
            $('#rorligt .rorligt-nav').addClass('nyheter-nav-anim');
        }else{
            $('#rorligt .rorligt-nav').removeClass('nyheter-nav-anim');
        }
        //console.log('NOW LISTENING ON WIN-RESIZE AGAIN.');
        //setupBusy = false;
    }
    
    function rorligtItems(){
        console.log('STARTING RÖRLIGT ITEMS');
        var rorligtItemCount = 0,
            rorligtItemSize = $('#rorligt_slider div.owl-stage div.owl-item').size();
        $('#rorligt_slider div.owl-stage div.owl-item').each(function(){
            rorligtItemCount++;
            $(this).attr('id','rorligt-item-'+rorligtItemCount)
                .addClass('rorligt-item');
            if(rorligtItemCount >= rorligtItemSize){
                console.log('RÖRLIGT ITEMS DONE.');
            }
        });

    }
    
        
    
    //BEFORE KONTAKT
    
    var break3first = true;
    function beforeKontakt(){
        if(!break3first && winW > 414){ //large
            $('#before-kontakt').css('background-image','url("https://matildabordin.se/wp-content/uploads/2019/03/break_img3_medium_2.jpg")')
            .attr('data-src','https://matildabordin.se/wp-content/uploads/2019/03/break_img3_medium_2.jpg');  
        }/*else if(winW > 400){ //medium
            $('#before-kontakt').css('background-image','url("https://matildabordin.se/wp-content/uploads/2019/03/break_img3_medium_2.jpg")')
            .attr('data-src','https://matildabordin.se/wp-content/uploads/2019/03/break_img3_medium_2.jpg');  
        }else{ //small*/
            else if(winW <= 414){
                $('#before-kontakt')
                    .css('min-height','40vh')
                    .css('max-height','60vh');
            }
        
        break3first = false;
        console.log('BEFORE KONTAKT-IMG SET/UPDATED');
    }

    //CV-LÄNK
    $('#cv .download-link').attr('id','cv-download-link');
    
    //SOCIALA LÄNKAR
    $('#kontakt .social-links').first().attr('id','social-links-container');
    var socialSize = $('#social-links-container a').size(),
        socialCount = 0;
    $('#social-links-container a').each(function(){
        socialCount++;
        var socialHref = $(this).attr('href'),
            currSocial = '';
        if(socialHref.indexOf('facebook') >= 0){
            currSocial = 'facebook';
        }else if(socialHref.indexOf('twitter') >= 0){
            currSocial = 'twitter';
        }
        if(socialHref.indexOf('instagram') >= 0){
            currSocial = 'instagram';
        }
        $(this).attr('id',currSocial+'-link')
            .addClass('social-link');
        if(socialCount >= socialSize){
            console.log('SOCIAL LINKS DONE.');
        }
    });
    
    //KONTAKT-FORMULÄR
    $('#kontakt .uk-container div .uk-grid-item-match').first().attr('id','contact-form-container');
    $('#kontakt .happyforms-flex input').addClass('kontakt-input');
    //KONTAKT INPUT-LABELS
    
    //TELEFON (ÖVERFÖR LAYOUT TILL CSS)
    $('#kontakt .uk-card-header.uk-padding-remove.uk-margin')
        .attr('id','tel-container');
    
    $('#kontakt .uk-width-auto.uk-first-column')
        .attr('id','tel-icon');
    
    $('#kontakt .uk-width-expand p')
        .attr('id','tel-num');

    
    /*
    $('#kontakt .uk-card-header.uk-padding-remove.uk-margin, #kontakt .uk-card-header.uk-padding-remove.uk-margin > div, #kontakt .uk-card-header.uk-padding-remove.uk-margin > div uk-width-expand').css('display','inline-block').css('width','auto');
    $('#kontakt .uk-card-header.uk-padding-remove.uk-margin p').first().css('font-size','.6em').attr('id','phone-txt');
    $('#phone-txt').css('display','inline-block');*/
    
    //KONTAKT SUMBIT
    $('#kontakt .happyforms-part--submit input')
        .attr('id','kontakt-submit-btn')
        .addClass('btn');
    console.log('KONTAKT FORMULÄR DONE.');

    //BILDER - VISA/DÖLJ ALBUM
    var currAlbum = $('#album-btn-portratt').attr('data'),
        albumsHidden = false;
    //KÖR I STYLE.CSS
    $('.album-container')
        .css('height','0px')
        .css('width','100%')
        .css('overflow','hidden')
        .css('opacity',0);
    $('#portratt-container')
        .css('height','auto')
        .css('opacity',1);
    
    $('.album-btn').click(function(){
        if(currAlbum && !albumsHidden){
            $(currAlbum)
                .css('height','0px')
                .css('width','100%')
                .css('overflow','hidden')
                .css('opacity',0);
        }
        if(currAlbum !== $(this).attr('data') || albumsHidden){
            $('#bilder').removeClass('no-min-height');
            AOS.refresh();
            currAlbum = $(this).attr('data');
            $(currAlbum)
                .css('height','auto')
                .css('width','100%');
            $(currAlbum).animate({
                opacity: 1   
            }, 1000, function(){
                albumsHidden = false;
            });
        }else{
            $('#bilder').addClass('no-min-height');
            AOS.refresh();
            albumsHidden = true;
        }
    });
    
});