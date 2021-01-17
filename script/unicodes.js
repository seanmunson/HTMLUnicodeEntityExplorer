
            
            currentpage = 0;
            CreateCharGrid(currentpage);
            
            let bookmarks = loadBookmarks(); 

            rezBookmarks();


            if (Object.keys(bookmarks).length==0)
            {
                addBookmark("last", Date()); 
                saveBookmarks();
            }  
            function rezBookmarks(){
                if (Object.keys(bookmarks).length <=1) return ;
                let rezzedhtml = "" + Object.entries(bookmarks).reduce( (tot, cur, acc) =>{
                    if (cur[0]=="last")
                    {
                         return tot;
                    }
                    else {
                        return tot + rezOneBookmark(cur);
                    }
                },"");
                bookmarkPanel.innerHTML = rezzedhtml;
            }
            function rezOneBookmark( obj){
                let charNumber= obj[0]; 
                let bookmarkName = obj[1].val;                
                return `<div class="bookmark" id="bn${charNumber}"><input type="button" value="${bookmarkName}" onclick="jumpTo(${charNumber})" /> <div class="closebutton" onclick="deleteBookmark(${charNumber})">&#11613;</div></div>`
            }
            
            function jumpTo(newId){
                currentpage = newId - (newId % 10);
                rezBookmarks();
                CreateCharGrid(currentpage);

            }
            function dateFromNow(numberOfDays){
                let date = new Date();
                return Date(date.setTime(date.getTime() + numberOfDays * 24*60*60*1000));
            }
            function addBookmark(name, value , days=3650){
                let d = Date(dateFromNow(days));
                bookmarks[name]= {val: value, date:d};
                rezBookmarks()
            }
            function saveBookmarks(){
                let domain =  document.domain ==='localhost'? "": `Domain=.${document.domain}`;
                let path = "Path=/";
                let cookieToBeWritten =  Object.keys(bookmarks).map( (k )=>{
                return `${k}=${bookmarks[k].val};${domain};${path}` ;
                })             
                cookieToBeWritten.forEach( (s, i, arr)=>{
                    console.log (s);
                    document.cookie = s;

                })
                console.log(document.cookie);
            }
            function loadBookmarks()
            {
                let c = decodeURIComponent(document.cookie);  

                if (c.length==0)
                {
                    return {};
                }
                else
                {
                    marks={};
                    const cs = c.split(";");
                    cs.forEach( o=> {
                        let tks = o.split(',');
                        let csn = tks[0].split('=');
                        if (csn[0]=='last' || isNumeric(csn[0]))
                        {
                            marks[ csn[0].trim()]={};
                            marks[csn[0].trim()].val = csn[1];
                        }
                    })
                    return marks;
                }
            }
            function isNumeric(str) 
            {
                        if (typeof str != "string") return false // we only process strings!  
                        return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
                                !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
                        } 
            function deleteBookmark(id)
            {
                if (bookmarks[id])
                    delete bookmarks[id];
                    document.cookie = `${id}=; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
                rezBookmarks();
            }
            function makeBookmark(id)
            {
                let name = prompt("Enter a name for bookmark at @"+id, `&#${id};`);

                if (name!=null)
                {
                    addBookmark(id,name);
                }
            }
            function clearBookmarks(){
                bookmarks={};
                addBookmark("last", Date()); 
                rezBookmarks();
            }





            function pgup(){
                currentpage+=100;
                CreateCharGrid(currentpage);
            }
            function pgdn(){
                if (currentpage>100) 
                    currentpage-=100;
                else
                    currentpage=0;
                CreateCharGrid(currentpage);
            }
            function CreateCharGrid(startpos=0){
                content.innerHTML="";
                let T = document.createElement('table');
                T.classList.add('asciitable');
                
                {
                    let TH = T.createTHead();
                    let hr = TH.insertRow();
                    const X = hr.insertCell(0);
                    X.innerText=startpos;
                    for (let i=1;i<11;i++) {
                        let c = document.createElement("td");
                        let t = document.createTextNode(i);                         
                        c.appendChild(t);
                        hr.appendChild(c);                                    
                    }                              
                    TH.appendChild(hr);                    
                }   
                let B = T.createTBody();                 
                {
                content.appendChild(T);
                    for (let i=0; i<11; i++)
                    {
                        let tr = B.insertRow();
                        const rh = tr.insertCell(0);
                        rh.innerText=i;
                        for(let j=0;j<10;j++){
                            let charcode = ((i*10) + j) + startpos;
                            td = tr.insertCell(-1);                                         
                            td.innerHTML = `<div class="codeshow" onclick="makeBookmark(${charcode});">&#${charcode};</div> <span class="codelabel">&amp;#${charcode};</span>`; 
                        }
                    }
                
                }                             
            }