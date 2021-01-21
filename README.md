
Follow By [Medium](https://medium.com/leo-comfortzone/angular-firebase%E5%AF%A6%E4%BD%9Ccircleci-ci-cd-flow-8bf262849e4b)

# Angular+Firebase實作CircleCI CI/CD Flow

跟著里歐學Web

![](https://cdn-images-1.medium.com/max/3360/1*4gpLMfcWFOJGHsyIyAXkLg.png)

## Purpose

首先講解一下這篇文章主要目的: 於求學階段的學生們，常常會上網自學一些技術、做些小作品或side project，但這些都僅限於個人獨立完成，或1~3人的規模，單純source code只用git版控後merge起來後繼續做，成品也沒有deploy到線上Demo，只能在local把玩。這樣在小規模的專案是沒有問題的，但以後勢必會碰到大規模的專案，每個人的coding style也不一樣，需要一定的規範去把關專案的source code，那就要接觸到整個開發專案的Flow。

為了讓新手也能快速上手專案開發流程的建置，擬定了一套簡易的專案開發流程，這套流程與大部分的專案開發流程是一致的，差別在於有的專案可能會做更細部的處理，例如部屬不同環境…等，這個就必須要靠各位自行努力了，或可能未來還會再寫出相關的文章。

## Tools and Technologies

1. [Github](https://github.com/)

1. [Angular](https://angular.io/)

1. [Firebase](https://firebase.google.com/) (Functions + Hosting)

1. [CircleCI](https://circleci.com/)

## Project Development flow

開始之前稍微講述一下標準的專案開發流程

![開發流程(From Web)](https://cdn-images-1.medium.com/max/4000/1*nCpZY_7JuOHH4iT5clDd4w.png)*開發流程(From Web)*

* 首先你會在開發專案管理平台接到你的issue或者是bug，這類的工具最簡易的就是github，github在很早之前就有issue的功能，是最常見的工具。

![](https://cdn-images-1.medium.com/max/5628/1*cJLlw0XeUqWU-ROP_JvDOA.jpeg)

* 切出一個branch去完成你的任務後，發一個pull request給團隊code review。

* 接著你的CI Agent會被觸發去檢查你這支branch的code，如果CI有問題出現Error，是不會讓你merge進master分支的，必須等你修正了source code再push一次到remote，再跑一次CI，成功了才能進行merge的動作。CI可以去檢查很多的東西，coding style、unit test…等，很多關於程式碼的檢驗都是在這一步完成的。
> 如果不知道什麼是CI/CD或不知道CI/CD是在做什麼的可以參考下面這篇文章
[**什麼是 CI / CD ?**
*為什麼我們需要 CI / CD ?*medium.com](https://medium.com/@Bear_/%E4%BB%80%E9%BA%BC%E6%98%AF-ci-cd-72bd5ae571f1)

* 當你的CI Success與code review完成後，可以操作你的平台merge進master裡，如果專案有不同的環境，可能就不一定是merge進master裡，會有其他相對應的分支。

* 之後會依據開發的規範，制定好什麼時候進行CD deploy進環境裡，可以即時部署，也可以設定排程自動部署。

這大概就是一個標準的開發流程，可能中間幾個步驟會多幾項比較特別的東西，但大致都是照這個流程去走。

## Hands-on

*我是用Mac做開發，所以中間可能會有些指令或操作與其他系統環境不一樣唷!*

***建立Angular專案***

用npm先下載angular-cli，打開你的cmd輸入下面指令，如果沒有Node要先去官方網站下載[Node.js](https://nodejs.org/en/)

    sudo npm install -g @angular/cli

確定一下你的cli有安裝好

    ng version

![](https://cdn-images-1.medium.com/max/2844/1*cnQtgoEMb3-OJl3s0OX14w.png)

來試著建立一個專案吧，過程中會詢問你是否建立routing和stylesheet format，這個練習不需要用到這些，所以我們隨意選擇就可以了

    cd Desktop
    ng new testCICD

接著用你習慣的程式碼編輯器開啟你的專案，我是習慣用vscode，先開啟你的專案，然後build起專案
> — open會在建置完後自動幫你打開網站，不加也是可以的唷!

    cd testCICD
    code .
    ng serve --open

建置完後要確保看到開啟這個網站

![](https://cdn-images-1.medium.com/max/5760/1*blObxam4MrFmatNZz-yKdQ.png)

***建立Github專案***

接著我們先把這個專案放進github裡，我們先把剛剛build起來的專案先暫停，有些人不會中止這個建置，導致他之後再build一次專案的時候會顯示目前這個port在使用中，所以要記得確實關閉，在你的cmd上按control+C。

在github new一個repo後就可以將程式碼push進去了，前幾步在ng new專案的時候，他就已經幫你把專案加進git並commit一次了，你只需要將專案push上remote就可以了!

![](https://cdn-images-1.medium.com/max/4108/1*9-nuIlc5OZ2AOrMbZyBdQA.png)

![](https://cdn-images-1.medium.com/max/5160/1*o5-fHrxcYytVuNYeniRcew.png)

    git remote add origin https://github.com/HongLinLiao/testCICD.git
    git push -u origin master

![](https://cdn-images-1.medium.com/max/5760/1*I0h7vMCOG198Lqbq7rt6xg.png)

***建立Firebase專案***

![](https://cdn-images-1.medium.com/max/5760/1*fW-yB_qwuVqzO40LvylKZg.png)

將Firebase綁上一個應用程式，這裡會產生金鑰，先不用記沒關係，後面都還拿得到

![](https://cdn-images-1.medium.com/max/5416/1*Tg7VyH4V-Ot5sxFdAF039Q.png)

![](https://cdn-images-1.medium.com/max/3232/1*mIRRJOGYjeEuYhJOsljH7w.png)

先使用Hosting來代管我們的線上網站

![](https://cdn-images-1.medium.com/max/5492/1*zBcJDNV9Hk1Oc-UXON_8YA.png)

Firebase有很貼心的提醒你要下載firebase-tools、login和init

![](https://cdn-images-1.medium.com/max/3828/1*Ydm9X4Ag6rPAdo0QEx-NcQ.png)

![](https://cdn-images-1.medium.com/max/3828/1*FdAQ79n3ffO7kuc-5oNPSw.png)

這兩個網域就是之後deploy進去的網站位置

![](https://cdn-images-1.medium.com/max/5508/1*DtebFPYunOmQNP0cIy8YaQ.png)

中間要將firebase-tools加進依賴package裡，防止後面CI/CD找不到firebase這個指令(因為第一行是加在你這台電腦的全域裡，但CI/CD的server沒有)

    sudo npm install -g firebase-tools
    firebase login
    git branch deploy
    git checkout deploy
    npm install --save firebase-tools
    firebase init hosting

這裡有個陷阱，firebase預設抓的靜態檔案是在public資料夾，但是angular build出來的資料夾名稱是dist，如果你一直按Enter就會設定錯，記得要重新指向目錄

![](https://cdn-images-1.medium.com/max/2636/1*SIRXZjCCRkiq9DHdr5NVAw.png)

接著我們來手動部署看看可不可以正常運作，我們再build一次prod版本的靜態檔案，接著deploy上雲端，之後就可以點開我們上面說的網站位置就可以看到改變了!
> prod會自動minimize檔案的大小，不加上也是可以的

    ng build --prod
    firebase deploy --only hosting

![](https://cdn-images-1.medium.com/max/2640/1*X4kGYGLx988mygD3vve76w.png)

![](https://cdn-images-1.medium.com/max/5756/1*ORaAg9Gw64R4gxouNIFUbg.png)

***建立CircleCI專案並撰寫yaml檔執行CICD***

在CircleCI官網中註冊一個用戶，並且需要依據Github或Bitbucket去註冊

![](https://cdn-images-1.medium.com/max/5728/1*t3hQdHgrNmYwP-1iRrdawg.png)

於左方側邊欄選擇Add Projects

![](https://cdn-images-1.medium.com/max/5760/1*mi9_8eErmaX7dSxb8GRonw.png)

對你要綁定的repo按下set up project

![](https://cdn-images-1.medium.com/max/4060/1*BTcqJ3WITXBobcKTforU7A.png)

CircleCI會自己給你一個.yml的default範本，你可以自行選擇專案相對應的語言去修改範本並加入，為了快速建置，我直接給各位我的.yml的souce code，需要建立一個.circleci的的資料夾，並在資料夾裡新增一個名為config.yml的檔案，然後把程式碼貼進去

![](https://cdn-images-1.medium.com/max/5404/1*MfXJXDONTdCQItjh_9oFew.png)

在angular-build裡面會去build程式碼，如果有錯就會停住

firebase-deploy則是會先去check angular-build這個job是否成功，並且只有在merge進master才會觸發這個任務，把靜態檔案部署至雲端，做到即時部署

<iframe src="https://medium.com/media/c35bffe663de2f1e2fd6b0b8c96cec20" frameborder=0></iframe>

上面firebase deploy後面有加一串TOKEN，這個TOKEN是可以為了證明CircleCI的這個Project是有得到Firebase專案管理者的授權，要用firebase-tools產出之後加進CircleCI裡面

    firebase login:ci

![](https://cdn-images-1.medium.com/max/4440/1*_xAVaYOj315eX1nAET9ZEg.png)

之後去CircleCI的專案右上角點擊Project Setting -> Environment Variables -> Add

![](https://cdn-images-1.medium.com/max/5752/1*jMw2Dg6hqpcJ8y4wUNgEcg.png)

![](https://cdn-images-1.medium.com/max/5748/1*dLElm1-bRoRW_zLtbUfuoA.png)

![](https://cdn-images-1.medium.com/max/5752/1*VkAhxTuw3Yl3qIzBSiu6Hw.png)

Name為FIREBASE_TOKEN，Value為firebase login:ci產生的key

![](https://cdn-images-1.medium.com/max/5748/1*nxehYumgi4sb4kviJAZCnQ.png)

你現在看一定會是紅紅的error，因為我們還沒有把.yml push到remote，所以他找不到檔案

![](https://cdn-images-1.medium.com/max/4704/1*LJKJn4uje1rKH2vOw65tNw.png)

我們先推分支進remote

    git add --all
    git commit -m 'add CI/CD'
    git push --set-upstream origin deploy

把分支切到push的那一支，可以發現右下角有個在跑的標記

![](https://cdn-images-1.medium.com/max/4144/1*dw0DKO17fjhO8FffCOIzbA.png)

過一陣子之後會發現它跑完了，或是你可以點進去看他的狀態

![](https://cdn-images-1.medium.com/max/4888/1*euurwxCsUo6O3LXADr8Wfw.png)

接著我們要發Pull Request進master

![](https://cdn-images-1.medium.com/max/4140/1*_LviaqIcT0pK-0oOgiBTKQ.png)

![](https://cdn-images-1.medium.com/max/5528/1*kprJvqEmTKi3aOQ6p5Wt0A.png)

![](https://cdn-images-1.medium.com/max/5500/1*8o9agXaLBgqAyhlV5DtQdg.png)

![](https://cdn-images-1.medium.com/max/5552/1*kImKH7adKZ6hqwAT2M_HBQ.png)

![](https://cdn-images-1.medium.com/max/4064/1*CBEIZJDOn6BrZ601bYn5wQ.png)

然後你就會發現master就會再跑一次CI，成功之後會跑CD直接把dist裡面的靜態檔案部署上雲端，這樣就完成了一次整個開發的流程!

## Bonus: Continuous Deployment Firebase Function

如果你有使用過Firebase Cloud Functions，又很剛好你沒有自動部署API，那你一定是每次推送Source code時，手動deploy對吧! 但不覺得這是一件非常不合理的事嗎? 有時候我們會因為偷懶，所以沒有merge master最新版本的程式碼，導致我直接deploy我的API進去remote，但如果這時候remote有的API是你這個版本沒有的，你會把現在已經建立好的API刪除! 為了解決問題，我們可以把API的部署也加進CD裡面，當PR merge master後，會自動幫你部署API，只要沒有conflict，你就可以直接不取master merge直接上程式碼!

***綁定Funcitons功能***

先切換分支回master後，pull取最新版，並且新增一個分支來處理這次的任務

    git checkout master
    git pull
    git branch functions
    git checkout functions

幫專案init firebase functions，然後我是選擇用Typescript來編寫API

    npm install --save firebase-tools
    firebase init functions

你會發現程式碼專案的根目錄多了一個functions的folder，那API都會是在這個folder裡做編寫

首先我們打開functions -> src -> index.ts，我們要在這裡initialize這個應用程式，並且是用admin的角色去初始化這個application，所以我們要引用firebase-admin這個package

    const admin = require('firebase-admin');

    admin.initializeApp();

然後就可以開始寫API了，Firebase Cloud Functions有兩種API的寫法

一種是functions.https.onRequest，這種是走Restful的寫法，很正規，驗證方面都要自己來做，可以依照一般的API呼叫方法來call

另一種是functions.https.onCall，這種比較適合快速開發用，Client端會用Firebase package裡的function來請求這個API，它會自動包好有關Firebase驗證的資訊，你沒有辦法在這上面做驗證的加工，會直接把參數送進這個API裡面，如果沒有特別的需求，這個API的寫法會非常適合需要快速開發一個應用程式的開發人員
> 但是onCall這種寫法會有一點問題，有操作過Firebase realtime database或firestore的人都知道，firebase會有cold start的問題，最常見的解法就是你不停地去打API，讓它不要冷卻，如果你用onCall的方式去寫API，你需要花功夫去處理排程呼叫的問題，我沒有辦法手動不透過Client SDK去觸發這些API，我也在這上面有點卡關，當初不熟悉這些特性…

我們試著寫一支超廢的API然後部署上去吧XD

在index.ts中加入一支叫helloWorld的API，直接讓他回傳null

    exports.helloWorld = functions.https.onCall((*data*, *context*) => {

        return null;

    });

執行部署指令

    firebase deploy —- only functions

成功了!

![](https://cdn-images-1.medium.com/max/2504/1*GkRHPE3c1Hfm_N0ZDKrD4w.png)

接著將function的deploy也加進.yml檔裡的firebase-deploy

我們將這段deploy加在Deploy Prod Code之前，防止API deploy爆掉了，線上環境靜態檔案還是跟著更動

<iframe src="https://medium.com/media/c81b45e1eb0738b273fff190e07c094e" frameborder=0></iframe>

將程式碼上版後發Pull Request

    git add --all
    git commit -m 'add functions deploy'
    git push --set-upstream origin functions

![](https://cdn-images-1.medium.com/max/4712/1*I6x7JPYzXkwEOomxgchMhw.png)

最後可以發現Deploy Cloud Functions成功了，並且Functions的Deploy正確之後才Deploy靜態檔案，確保API運行的code與專案運行的code是一致的!

## **Conclusion**

這是我自己實作的第一套專案開發與建置流程，其實在打這篇的時候也是修修改改的，自己也是有很多沒有很了解的地方，內行的人就看得出來那個.yml可以再精簡一點，但這其實已經夠小型的專案開發了。為了讓像我一樣不停在增進自我能力的人能快速get到整套開發流程的精髓，我還是硬著頭皮把它打完了，未來我也會繼續分享我的知識，希望能幫助到正在努力學習的大家，也謝謝你把這篇看完!

附上Github完整程式碼:
[https://github.com/HongLinLiao/Angular-Firebase_CircleCI](https://github.com/HongLinLiao/Angular-Firebase_CircleCI)
