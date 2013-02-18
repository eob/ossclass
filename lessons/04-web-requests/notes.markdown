---
layout: exercise
title: Ajax Notes
---

The Story of a Web Connection
=============================

Abstract
--------

The web presents a strange programming model because it forces you into writing
an application that runs on two computers at once. This presents a number of
challenges in application design and state management. All of these design
issues, however, are ultimately influenced and built on top of the fundamental
relationship that the browser has with the server.

The goal of this lesson is to fully describe that browser-server relationship.
If you understand the details about how the browser makes requests to the
server, you will be able to make better decisions when faced with higher-level
design choices.

We will target:

*  What's in a web request
*  Life cycle of a web request
*  Ajax and Ajax Styles
*  The web security model

Introduction
------------

*Our perspective* in this lesson, for the most part, is going to be the
browser. There is a whole rich set of separate concerns for the server, but
those begin to eek into server-side application territory. 

For this lesson, we're interested in the code that initiates web connections:
be it a browser, a Javascript call, or an API request.

What's in a Web Request
-----------------------

### URL Part

    PROTO://DOMAIN:PORT/PATH#FRAGMENT?PARAMS

* Domain
* Path
* Port
* Fragment
* Parameters
* Protocol

### Payload Part

* HTTP Verb (`GET`, `POST`, `PUT`, `OPTIONS`, etc)
* `POST` data (depending...)
* Cookies
* Headers
  * What response types you accept back, etc

### If a web site is a collection of documents

Then `PROTO://DOMAIN:PORT/PATH` references a document. The HTTP verb specifies
an action on that document. The rest is largely irrelevant.

### If a web site is docuents + CGI scripts

Then URL params, cookies, and post data represent input to those scripts. Those
script, in turn, return *customized* documents.

### If a web site is an application

Then each web request is an API call into that application.

The Life of a Web Request
-------------------------

[W3C Navigation Timing Recommendation](http://www.w3.org/TR/navigation-timing/)

An image of the process:

![Timing Overview](http://www.w3.org/TR/navigation-timing/timing-overview.png) 

1.  Before you hit the network
   1.  Redirect
   2.  App Cache
2. The Network
   3.  DNS Lookup
   4.  TCP Connect 
   5.  Request (`requestStart`)
   6.  Response (`responseStart`, `responseEnd`)
3. Processing the Response
   7.  `domLoading`
   8.  `domInteractive`
   9.  `domContentLoaded`
   10.  `domComplete`
   11.  onLoad (`loadEventStart`, `loadEventEnd`)

So if you're used to the common `onLoad` callback of jQuery, you're hooking in
to the very end of this process.

### Before you Hit the Network

The pre-network part of this lifecycle is interesting for caching and offline
reasons. The browser gives you a number of mecahanisms to cache content
locally, such that the network portion of this pipeline is completely skipped.
With HTML5 you even have access to the cache controls from within Javascript.

<div class="demo">
  <h4>HTML5 Manifest Demo</h4>
</div>

### Once you hit the browser

The document is scanned in linear order. Linked Javascript, scripts in the head
are implemented in blocking fashion (unless in closure?) The in the body in
linear fashion.

<div class="demo">
  <h4>Script Ordering Demo</h4>
  <p>Show timing differences</p>
</div>

### Scripts

Life of an Ajax Requset
-----------------------

### Callbacks

*  Why are they used?
*  How to stash state?
*  Wide versus deep design
*  Anonymous v. Named

### Security

#### JSONP

First define a function that takes a JSON object

     var showPictures = function(data) {
       // do stuff
     }

Then make jsonp call

     http://api.flickr.com/pictures?callback=showPictures

It returns you a script

     showPictures( data );

<div class="demo">
  <h4>Exercise</h4>
  <p>cross-origin-json.html</p>
  <p>Have change pushed over Github</p>
</div>

#### Cross Origin Resource Sharing (CORS)

HTML5 Rocks has a [good tutorial](http://www.html5rocks.com/en/tutorials/cors/)

Headers

     Access-Control-Allow-Origin: *

To enable cookies over CORS, you need to set

    xhr.withCredentials = true;

on the client, and

    Access-Control-Allow-Credentials: true

in the server headers.

    JS           BROWSER            SERVER
    xhr.send() -->
                    preflight -------->
                    (if necessary)
 
                    <-------- preflight
                    (if necessary)
 
                    actual request --->
 
                    <--- actual response
 
    <------------ 
    fire onload() or onerror()

A preflight looks like

   OPTIONS /cors HTTP/1.1
   Origin: http://api.bob.com
   Access-Control-Request-Method: PUT
   Access-Control-Request-Headers: X-Custom-Header
   Host: api.alice.com
   Accept-Language: en-US
   Connection: keep-alive
   User-Agent: Mozilla/5.0...

A preflight response looks like:

   Access-Control-Allow-Origin: http://api.bob.com
   Access-Control-Allow-Methods: GET, POST, PUT
   Access-Control-Allow-Headers: X-Custom-Header
   Content-Type: text/html; charset=utf-8

<div class="demo">
  <h4>Enabling CORS Headers</h4>
  <p>Do it on my computer. Have to rebase</p>
</div>

### Ajax Styles


