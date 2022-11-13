(


 ( set title "ljcucc" )

 ( set iconStyle "border-radius: 100%;")
 ( set iconSize 200)

 ( set webNL "<br>")

 ( set blod 
       (def (content) (joinl "<strong>" $content "</strong>" ""))
       )

 ( set div 
       (def (body) (joinl "<div>" $body "</div>" ""))
       )
 (set limitedBox (def ( width height content) (joinl "<div style=\"max-width:" $width ";height:" $height ";box-sizing:border-box;\">" $content "</div>" "")))

 (set li (def (cont) (joinl "<li>" $cont "</li>" "")))
 (set ul (def (cont) (joinl "<ul>" $cont "</ul>" "")))

 (set version (def () (print "version: wolf_lisp v0.1.0")))

 (set help (def () (
                    (print (joinl 
                             "<div>"
                             "[ helper ]"
                             ""
                             "\"Wolf interactive terminal\""
                             "is a terminal powered by custom scripting language which simular to lisp syntax."
                             ""
                             "functions/commands:"
                             ""
                             (ul
                               (joinl (li "( intro ) - print intro")
                                      (li "( clear ) - clear screen" )
                                      (li "( print ) - append HTML strings to terminal" )
                                      (li "( hint ) - generate hint HTML string" )
                                      (li "( img ) - generate img tag HTML string" )
                                      (li "( join (*list) *string ) - add string between items" )
                                      (li "( joinl ...*list *string ) - inline version of (join) " )
                                      (li "( set name value ) - set scoped variable" )
                                      (li "( if ...*con_or_then *else) - value in (then) will be returned. etc. (if con (then)) (if con (then) (else)) (if con (then) con (then) ... *(else is optinoal)) " )
                                      (li "( def (...args) (todo)) - define a function object, will return a function object")
                                      (li "( help ) - diplay help" )
                                      (li "( version ) - display version" ) 
                                      (li "( + ...valeus) - Addition" ) 
                                      (li "( - ...valeus) - Subtraction. etc 1 - 2 - 3 === ( - 1 2 3 )" ) 
                                      (li "( * ...valeus) - Multiplication" ) 
                                      (li "( / ...valeus) - Division. etc  1 / 2 / 3 === ( / 1 2 3 )" ) "" ) )

                               
                             ""
                             "shortcuts: (keyboard only)"
                             ""
                             (ul (joinl 
                                   (li "Ctrl+L - Clear screen")
                                   (li "Ctrl+U - Clear line")
                                   ""))
                             "</div>"
                             $webNL
                             )) ; print joinl
                    )))

 ( set intro 
       (def () (
                (print 
                  ( div (joinl
                          (div (joinl 
                                 (blod "@ljcucc") " = linjason + cucc" "")
                               )

                          ""
                          (img "./icon.png" $iconSize $iconSize $iconStyle)
                          ""
                          (limitedBox "800px" "auto" "Hi, I'm <stron>IT. Wolf</strong> welcome to my home site. here's some of my linktree or just look around... feel free to typing some commands under the page ;)" )
                          "<br>"
                          )))

                (print (joinl
                         (link "Twitter" "https://github.com/ljcucc")
                         (link "Wiki" "https://wiki.ljcu.cc")
                         (link "Github" "https://github.com/ljcucc")
                         (link "Unsplash" "https://unsplash.com/@ljcucc")
                         "<div style=\"height:4px;\"></div>"
                         ))
                (print (hint "hint: type \"help\" to get all commands."))

                ))
       ) ;set

 (intro)


 )
