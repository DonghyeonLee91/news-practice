let news = [];
let page = 1;
let total_pages = 0;
let menus = document.querySelectorAll(".menus button");
menus.forEach(menu => menu.addEventListener("click",(event)=>getNewsByTopic(event)));

let searchButton = document.getElementById("search-button");
let url ;


const openNav = () => {
  document.getElementById("mySidenav").style.width = "250px";
};
const closeNav = () => {
  document.getElementById("mySidenav").style.width = "0";
};

const getNews= async () =>{
    try{
      let header = new Headers({'x-api-key':'vsLcpUR1Sj1kLg9oq1IdpYAxV_AMW9p76Q_XqlUulqk'});
      url.searchParams.set('page', page);
      let response = await fetch(url,{headers:header});
      
      let data = await response.json();
      if(response.status == 200){
        if(data.total_hits == 0 ){
          throw new Error("검색된 결과값이 없습니다.");
        } 
        news = data.articles;
        total_pages = data.total_pages;
        page = data.page;

        
      render(); 
      pagenation();
      } else {
        throw new Error(data.message)
      }
    } catch(error){
      console.log("잡힌에러는",error.message);
      errorRender(error.message);
    }
 
};


const openSearchBox = () => {
  let inputArea = document.getElementById("input-area");
  if (inputArea.style.display === "inline") {
    inputArea.style.display = "none";
  } else {
    inputArea.style.display = "inline";
  }
};
const getLatestNews = async () =>{
   url = new URL('https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=sport&page_size=10') ;
   
   getNews ();
};
const getNewsByTopic = async (event) =>{
  let topic = event.target.textContent.toLowerCase();
   url= new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10&topic=${topic}`);
 
   getNews ();
};
const getNewsBykeyword = async () =>{
   let keyword = document.getElementById("search-input").value;
    url = new URL(`https://api.newscatcherapi.com/v2/search?q=${keyword} &countries=KR&page_size=10`);
   
    getNews ();
  };








const render = () =>{
 let newsHTML = '';
 newsHTML = news.map((item)=>{
     return `<div class="row news">
     <div class="col-lg-4">
       <img
         class="news-img"
         src="${item.media ||
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU"}"
         alt=""/>
     </div>
     <div class="col-lg-8">
       <h2>${item.title}</h2>
       <p>${  item.summary == null || item.summary == ""
       ? "내용없음"
       : item.summary.length > 200
       ? item.summary.substring(0, 200) + "..."
       : item.summary}</p>
       <div>${item.rights || "no source"} * ${moment(item.published_date).fromNow() }</div>
     </div>
   </div>`
 }).join('');



 document.getElementById("news-board").innerHTML = newsHTML;
};
const errorRender = (message) =>{
  let errorHtML = `<div class="alert alert-danger text-center" role="alert">
 ${message}
</div>`
  document.getElementById("news-board").innerHTML = errorHtML;
}

const pagenation = ( ) => {
let pagenationHTML = ``;
 let pageGroup = Math.ceil(page/5);
 let last = pageGroup * 5;
  if (last > total_pages){
    last = total_pages;
  }
 let first = last - 4 <= 0 ? 1 : last - 4; 
if (first >= 6){
 pagenationHTML =  `<li class="page-item" onclick="movetopage(1)">
 <a class="page-link" href="#" aria-label="Previous">
   <span aria-hidden="true">&lt;&lt;</span>
 </a>
</li><li class="page-item">
<a class="page-link" href="#" aria-label="Previous" onclick="movetopage(${page-1})">
  <span aria-hidden="true">&lt;</span>
</a>
</li>`};
 for(let i = first; i<=last;i++){
   pagenationHTML+=`<li class="page-item ${page==i?"active":""}"><a class="page-link" href="#" onclick="movetopage(${i})">${i}</a></li>   `
 };
if (last < total_pages){
pagenationHTML+=` <li class="page-item" onclick="movetopage(${page+1})">
<a class="page-link" href="#" aria-label="Next">
  <span aria-hidden="true">&gt;</span>
</a>
</li><li class="page-item" onclick="movetopage(${total_pages})">
<a class="page-link" href="#" aria-label="Next">
  <span aria-hidden="true">&gt;&gt;</span>
</a>
</li>`};

   document.querySelector(".pagination").innerHTML = pagenationHTML;
};

const movetopage = (pageNum) =>{
  page = pageNum;
  getNews();

};



searchButton.addEventListener("click",getNewsBykeyword);
getLatestNews();