# Hass(developing! not bet!)

An Engine

use **css like syntax** to create dom

for example:

### 1. create multiple elements
```css
div{
  "hello"   /*Explicit declare content*/
  3*p{      /*create three p element*/
    beauty  /*Implicit declare content*/ 
  } 
}
```
  + use /* */ as **annotation**
    - (because it doesn't depend on '\n')
  + you can **put every things** you like into "" ,but **be careful** when it is Implicit declaration
### 2. variable -- $
```css
3*p{
  $       /*variable*/
}([1,2,3])  /*just one way*/
```
  + now you can get three paragraph
    - ```html
       <p>1</p>
       <p>2</p>
       <p>3</p>
      ```
  + hold your curiosity!! I will tell more about variable at **point 5**;
### 3. Selector! ==> Creator!
```css
  div.oneclass .twoclass #oneid [style="width:8px;",title="div"]{
      3*p{
          "good"
      }
  }
```
 + Just display as what you like
### 4. Abreviation
```css
.good{
  div#head{}
  3*p{}
  div#foor{}
}
``` 
  + just like jade ,it will create an element : `<div class = "good">` 
  + also can: #good{} ,[..]{}
  + if you write `#div#gooddiv{}` finally it became: `<div id = "gooddiv">`
### 5. Advance variable

#### 5.1 more than one $ in one element;
```css
3*.#good$div{  
  $
}([1,2,3],[0,0,1])  /*past by array order by order*/
```
+ you will get :
```html
	<div id = "good1div"> 0 </div>
	<div id = "good2div"> 0 </div>
	<div id = "good3div"> 1 </div>
```
 
#### 5.2 when it is wrapped by a father;
+ don't give values to child , but declare evaluation by () on **parent**
```css
2*div{
  2*div{$}
}()
```
you get :

```html 
<div>
	<div>0</div>
	<div>1</div>
</div>
<div>
	<div>2</div>
	<div>3</div>
</div>
```
+  declare evaluation by () on **children**
```css
2*div{
  2*div{$}()
}
```
you get : 
    
      ```html 
        <div>
          <div>0</div>
          <div>1</div>
        </div>
        <div>
          <div>0</div>
          <div>1</div>
        </div>
      ```
      
 #### 5.3 Defualt values
 + it is start at 0;
 + you can set start value like this : `3*div{$}(2)` then get : `<div>2<div><div>3<div><div>4<div>`
 #### 5.4 Declare **JS variable**
 ```css
  div{$}(good)    /*Declare js variable*/
  div{$}("good")  /*set start value , finaly you get :<div> good0 </div>*/
 ```
 but how to use the variable?
 #### 5.5 Access variable
  ```css
  div{$}(good)
  div#Suger{$}(good)
 ```
there are two  **good**
- first one : Hass.arg.good;  //Hass grobal variable
- second one : Hass.at(Suger).good  //One Elememt's variable

It is **complex!!**,I will tell more at **JS Use Section**


