class Page{
constructor(id_val,flag_val){
this.id = id_val;
this.flag=flag_val;
}
get id(){ return this._id }
set id(id_val){ this._id = id_val }
get flag(){ return this._flag }
set flag(flag_val){ this._flag = flag_val }
getNewStyle(){this._id.className="newStyle"}
getOldStyle(){this._id.className="oldStyle"}
setAttributes(index){this._id.innerHTML=index;this._id.setAttribute('id',index)}
getHidden(){this._id.hidden=true}
getRevealed(){this._id.hidden=false}
}
const DEFAULT_PAGE=1;
let current_page=1;
const API_KEY="api_key=9b62c3eb4a6bc8acd4e26602f16fa744";
const BASE_URL="https://api.themoviedb.org/3/";
const MOVIE_URL=BASE_URL+"discover/movie?"+API_KEY+'&sort_by=popularity.desc';
const IMAGE_URL="https://image.tmdb.org/t/p/w500";
const SEARCH_URL=BASE_URL+"search/movie?"+API_KEY+"&sort_by=popularity.desc&query=";
let pages=Array(0);
let next=document.getElementById('next');
let prev=document.getElementById('prev');
let f=document.getElementById('search_movie');
const paging_parent=document.getElementById('paging_box');
searchMovie();
clickEvents();
pushIntoArray(0);
getMovies(MOVIE_URL,current_page);

function getMovies(my_api,current_page){
  main.innerHTML=' ';
 my_api+="&page="+current_page;
fetch(my_api).then(res=>{
return res.json()
}).then(data=>{
let arr=data.results;
if(arr&&arr.length>0){
return setTimeout(
arr.forEach(movie=>{
addMovie(movie);
}),9000);
}
}).catch(err=>{
console.log(err.message);
})
}
function addMovie(movie){
let {title,poster_path,overview,release_date,vote_average}= movie;
let newMovie=document.createElement('div');
newMovie.classList.add("movie");
newMovie.innerHTML=`<div class="movie_element">
<img class="poster" src="${IMAGE_URL+poster_path}" onerror="if (this.src != 'error.jpg') this.src = 'no-poster-available.jpg';"/>
<div class="movie_info">
<h3 class="movie_name">${title}</h3>
<span class='${getRatingColor(vote_average)}'>${vote_average}</span>
</div>
<div class="description">
<h3 >${title}</h3>
${overview}
<h4>Release year:${release_date}</h4>
</div>
</div>`
main.appendChild(newMovie);
}
function searchMovie(){
f.addEventListener('click',(e)=>{
e.preventDefault();
e.stopPropagation();
let user_input=document.getElementById('search_input').value;
if(user_input&&user_input.trim()!=''){
let query=SEARCH_URL+user_input;
console.log(query);
getMovies(query,DEFAULT_PAGE);
}

})
}
function getRatingColor(vote){
return (vote>=4.5&&vote<7)?'yellow':(vote>=7)?'red':'green';
}
function pushIntoArray(last_index){
let first=last_index;
let last=first+5;
for(let i=first;i<last;i++){
last_index++;
let element=createNewPage(last_index);
pages.push(element);
}
onClickBtn(first);
}
function clickEvents(){
next.addEventListener('click',(e)=>{
  e.preventDefault();
  e.stopPropagation();
let last_index=searchLastIndex();
if(last_index&&last_index%5==4&&last_index!=0){
if(!pages[last_index+1]){
pushIntoArray(last_index+1);
}
pages.forEach((element,index)=>{
  setPagesGivenState(element,index,last_index,1);
})
}
let index=checkIfMarked();
if(pages[index]){
getPageMarked(index+1,index+2);
}
})
prev.addEventListener('click',(e)=>{
  e.preventDefault();
  e.stopPropagation();
let last_index=searchLastIndex();
if(last_index&&pages[last_index]&&last_index%5==0&&last_index!=0){
pages.forEach((element,index)=>{
setPagesGivenState(element,index,last_index,0);
})
}
let index=checkIfMarked();
if(pages[index]){
getPageMarked(index-1,last_index);
}
})
}
function onClickBtn(first){
pages.filter((element,index)=>(index>=first)).forEach((element,index)=>{
element.id.addEventListener('click',(e)=>{
  e.preventDefault();
  e.stopPropagation();
console.log(element);
checkIfMarked();
element.flag=1;
element.getNewStyle();
let current_page=element.id.innerText;
getMovies(MOVIE_URL,current_page);
})})
}
function createNewPage(index){
let new_btn=document.createElement('button');
let element= new Page(new_btn,0);
element.setAttributes(index);
if(index%5==1){
element.getNewStyle();
element.flag=1;
}
else{
element.getOldStyle();
}
paging_parent.insertBefore(element.id,next);
element.id=document.getElementById(`${index}`);
console.log(element.id);
return element;
}
function searchLastIndex(){
return pages.findIndex(element=>element.flag==1) ?? null;
}
function getPageMarked(index,last_index){
pages[index].flag=1;
pages[index].getNewStyle();
current_page=last_index;
getMovies(MOVIE_URL,current_page);
}
function checkIfMarked(){
let index=searchLastIndex();
if(pages[index]){
pages[index].flag=0;
pages[index].getOldStyle();
return index;
}
return;
}
function setPagesGivenState(element,current_index,last_index,flag){
let half;
(current_index%5==4)?half=current_index-2:(current_index%5==3)?half=current_index-1
:(current_index%5==2)?half=current_index:(current_index%5==1)?half=current_index+1
:half=current_index+2;
  let last_index_dec=Math.abs(last_index-half);
  let current_index_dec=Math.abs(current_index-half);
  let dec=Math.abs(current_index-last_index);
return flag?(last_index_dec>2&&current_index_dec<=2&&current_index>last_index&&dec<=5)?element.getRevealed():element.getHidden():
(last_index_dec>2&&current_index_dec<=2&&current_index<last_index&&dec<=5)?element.getRevealed():element.getHidden();
}
