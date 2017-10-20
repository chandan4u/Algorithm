// ####################################################################################################################
// ########################################### Interview Algorithm ####################################################
// ####################################################################################################################

// ------------------------------------------- Server Configuration ---------------------------------------------------

const express = require('express');
const app = express();
const http = require('http').Server(app);
const bodyParser = require('body-parser');
const path = require('path');
const formidable = require('formidable');
const fs = require('fs');

// ------------------------------------------- Server Configuration ---------------------------------------------------

// -------------------------- Expriment TXT file upload and read ------------------------------------------------------

app.get('/txtread', function(req, res){
    res.render(__dirname + '/public/txtfile');
});

app.post('/txtread', function(req, res){

    var form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, '/uploads');
    var listConsist = [];
    form.on('file', function (field, file) {
        var array = fs.readFileSync(file.path).toString().split("\n");
        array.forEach(function(k){
            var content = k.split(" - - ")[0];
            if(listConsist[content])
            {
                ++listConsist[content];
            }
            else
            {
                listConsist[content] = 1;
            }
        });
        res.setHeader('Content-Type', 'text/html');
        Object.keys(listConsist).forEach(function(i){
            res.write(i+' lies '+listConsist[i]+' times.<br/>');
        });
        res.end();
    });

    form.parse(req);

});

// ------------------------- Word Count --------------------------------------------------

app.get('/wordcount', function(req, res){
    res.render(__dirname + '/public/wordcount');
});

app.post('/wordcount', function(req, res){ 

    var form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, '/uploads');
    var maxLength = "";
    form.on('file', function (field, file) {
            fs.readFile(file.path, function(err, data){
                var arr = data.toString().split(" ");
                arr.forEach(function(k){
                    if(k.length % 2 == 0 && maxLength.length < k.length)
                    {
                        maxLength = k;
                    }
                })

                res.setHeader('Content-Type', 'text/html');
                res.write(maxLength);
                res.end();

            })
            
        });

    form.parse(req);

});

// -------------------------- OLX Question ------------------------------------------------

app.get('/olx', function(req, res){
    res.render(__dirname + '/public/olx');
});

app.post('/olx', function(req, res){

   var form = new formidable.IncomingForm();
   form.uploadDir = path.join(__dirname, '/uploads');
   var listConsist = [];
   form.on('file', function (field, file) {
   // ------------------- Read File Break in Array with new line ------------------------------------ 
   var lines = fs.readFileSync(file.path).toString().split("\n");
   // ------------------- Take Firt Number as total number of value ---------------------------------
   var n = lines[0]; 
   // ------------------- Assign Two Array for store Product and Category ---------------------------
   var qArr = [];
   var sArr = [];
   // ------------------- Separate Q and S value ----------------------------------------------------
    for(var i=1; i <= n; i++)
    {
        var arr = lines[i].toString().split(" ");
        if(arr[0] == 'Q')
        {
           qArr.push(lines[i]);        
        }
        else
        {
           sArr.push(lines[i]);       
        }
    }

             //   console.log(sArr);
             //   console.log(qArr);
                


    qArr.forEach(function(k){
        var count = 0;
        var innerQarr = k.toString().split(" ").splice(2,4);
        for(var qid=0; qid < innerQarr.length; qid++)
        {
            sArr.forEach(function(m){
                var innerSarr = m.toString().split(" ").splice(2,4);
                firstStatus = false;
                for(var sid=0; sid<innerSarr.length; sid++)
                {
                    innerQPR = innerQarr[sid].toString().split(".");
                    innerSPR = innerSarr[sid].toString().split(".");


                   console.log("<<<<< Sub Arr",innerQPR,">>>>>",innerSPR);

                    
                    if(innerQPR.length == 1  && innerQPR[0] == innerSPR[0])
                    {
                        //console.log("First>>>>", innerQPR.length, innerQPR[0], innerQPR[0]);
                        if(firstStatus)
                        ++count;
                        firstStatus = true;
                    }
                    else if(innerQPR.length == 2 && innerQPR[0] == innerSPR[0] && innerQPR[1] == innerSPR[1])
                    {
                       // console.log("Second>>>>", innerQPR.length, innerQPR[0], innerQPR[0], innerQPR[1], innerQPR[1]);
                        if(firstStatus)
                        ++count;
                        firstStatus = true;
                    }
                    else
                    {
                        break;
                    }

                }
            });
        }

        console.log(count/2);

    });            

      qArr.forEach(function(k){
           var count = 0;
           var innerQarr = k.toString().split(" ").slice(2,4);
           for(var i = 0; i < innerQarr.length; i++)
           {
                sArr.forEach(function(m){ 
                   var innerSarr = m.toString().split(" ").slice(2,4); 
                   for(var q =0; q < innerSarr.length; q++){
                        var _finalQarr = innerQarr[i].toString().split(".");
                        var _finalSarr = innerSarr[i].toString().split(".");
                        if(_finalQarr[0] == _finalSarr[0] && _finalQarr[0].length == 1)
                        {
                            if(_finalQarr[0] == _finalSarr[0] && _finalQarr[0].length == 1)
                                {
                                    ++count;
                                }
                        }
                   } 
                });       
          }
                console.log(count);
      });

       // res.end();
    

    });

    form.parse(req);

    res.end();

});



// -------------------------- OLX Question ------------------------------------------------

// -------------------------- Fibnoice Series ---------------------------------------------

app.get('/fibonice', function(req,res){

        var getLength=10;
        var a=0;
        var b=1;
        var sum=0;
        for(var i=0; i<getLength; i++)
        {
                // a=b;
                // b=sum;
                // sum = a+b;
                // console.log(sum);

                console.log(a);
                a=a+b;
                b=a-b;

        }

        res.end();

});

// -------------------------- Fibnoice Series ---------------------------------------------

// -------------------------- Factorial Number -------------------------------------------------------------------------
app.get('/factorial', function(req,res){
    
        var getLength = 5;
        var fact=1;
        for(var i=1; i<=getLength; i++)
        {
            fact = fact * i
        }
        console.log(fact);
    
        res.end();
    
});
// -------------------------- Factorial Number -------------------------------------------------------------------------

// -------------------------- String Read and delete duplicate sequence ------------------------------------------------

app.get('/word-sequence', function(req, res){
    res.render(__dirname + '/public/sequence');
});

app.post('/word-sequence', function(req, res){ 

    var form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, '/uploads');
    var maxLength = "";
    form.on('file', function (field, file) {
            fs.readFile(file.path, function(err, data){
                var newArr = data.toString().split("");
                var status = true;
                var newArr = [];
                    while(status)
                    {
                       newArr = seq(newArr);
                       if(newArr.length == 0)
                        status = false;
                    }
                    function seq(callArr)
                    {
                      //  if()
                    }
                console.log(arr);
                res.end();
            })
            
        });

    form.parse(req);

});

// -------------------------- String read and delete duplicate sequence ------------------------------------------------

// -------------------------- Expriment TXT file upload and read -------------------------------------------------------

// -------------------------- Media.Net Max two product ----------------------------------------------------------------

app.get('/media-arr-product', function(req, res){

        var arr = [10,34,100,36,25,70,60];
        max=0;
        secMax=0;
        Object.keys(arr).forEach(function(k){
            if(arr[k] > secMax){
                if(arr[k] > max)
                {
                    secMax = max;
                    max = arr[k];
                }
                else
                {
                    secMax = arr[k];
                }
            }

        });

        console.log(max*secMax,"Max",max,"-- SecMax",secMax);

        res.end();

});

// -------------------------- Media.Net max two product ------------------------------------------------------------------

// ----------------------------- Media.Net two dimensional array --------------------------------------------------------- 

app.get('/two-dimensional-array', function(req, res){

    var i=2; var j=1;
    var arrTwo =[
            [10,40,80],
            [56,87,23],
            [76,43,67]
        ];
        var newArr = [];
        arrTwo.forEach(function(k){
            k.forEach(function(i){
                newArr.push(i);
            });   
        });
        console.log(newArr);
        console.log(newArr[arrTwo[0].length*i+j]);
        res.end();
});

// ----------------------------- Media.Net two dimensional array ---------------------------------------------------------

// -------- Start How to find the missing number in integer array of 1 to 100 --------------------------------------------------

app.get('/missing-number', function(req, res){
    
    var arr = [1,2,3,4,5,7,8,9,10];

  //  var expectedSum = 10 * ((10+1)/2) == 45

  //  var actualValue = 0;

    for(var i=0; i<arr.length - 1; i++)
    {
        if(arr[i]+1 != arr[i+1])
        {
            console.log(arr[i]+1);
        }

        // --------------- For Getting Single Value ----------------

        // var expectedSumForSingleValue = arr[last] * ((arr[last]+1)/2);
        // actualValue +=arr[i];
        // return expectedSum - actualValue;

        // --------------- For Getting Single Value ----------------


    }

        res.end();

    });


// -------- End How to find the missing number in integer array of 1 to 100 --------------------------------------------------

// -------- Start How to find duplicate number on Integer array --------------------------------------------------------------

app.get('/duplicate-number', function(req, res){
    
    var arr = [1,2,7,3,9,4,6,4,5,7,8,9,10];
    var duplicateArr = [];
    for(var i=0; i<arr.length; i++)
    {

            if(duplicateArr[arr[i]])
            {
                console.log(arr[i]);
            }
            else
            {
                duplicateArr[arr[i]] = 1;
            }
        
    }


        res.end();

    });

// -------- End How to find duplicate number on Integer array ----------------------------------------------------------------

// -------- Program to find the smallest positive missing number -------------------------------------------------------------

app.get('/smallest-positive-missing-number', function(req, res){
    
    var arr = [1,3,5,2,4,-1,-7,0,4,3,5];
    var sortedArr = insertionSort(arr);
    var start = 1;
    var negCount = 0;

    console.log(sortedArr);

    for(var i=0; i<sortedArr.length; i++)
    {

        if(sortedArr[i] < start)
        {
            ++negCount;
        }
        if(negCount == sortedArr.length)
        {
             console.log(start);
            break;
        }
        if(sortedArr[i] + 1 != sortedArr[i+1] && sortedArr[i] != sortedArr[i+1] && sortedArr[i] >= 0)
        {
            console.log(sortedArr[i]+1);
            break;
        }
        
    }

    function insertionSort (array) 
    {
        for(var i = 1 ; i < array.length;){
            if(array[i] < array[i-1]){
                var temp = array[i];
                array[i] = array[i -1];
                array[i -1] = temp;
                i--
            } else{i++}
        }
        return array
    }


        res.end();

    });

// -------- Program to find the smallest positive missing number -------------------------------------------------------------

// -------- Get Unpair Number ------------------------------------------------------------------------------------------------

app.get('/get-unpair-number', function(req, res){
    
        var A = [9,3,6,3,9,6,7,9,9];
        var ss={};
        for(var i=0; i<A.length; i++)
        {
            if(ss[A[i]])
            {
                ++ss[A[i]];
            }
            else
            {
                ss[A[i]] = 1;   
            }
            
            
        }

        Object.keys(ss).forEach(function(k){
        if(ss[k] < 2)
        console.log(k);
        });

        res.end();
});

// -------- Get Unpair Number -------------------------------------------------------------------------------------------

// -------- Binary Segment Checker -BinaryGap --------------------------------------------------------------------------

app.get('/binary-checker', function(req, res){
    
        var getNumber = 1041;
        var getBinary = decToBin(getNumber);
        var counter = 0;
        var max = 0;

        console.log(getBinary);

        for(var i=0; i<getBinary.length; i++)
        {
            if(getBinary[i] ==1)
            {
                if(max <= counter) max = counter;
                counter = 0;
            }
            else
            {
                ++counter;
            }
        }
        
        console.log(max);
        
        function decToBin(number)
        {
            var converted = [];
            
            while(number>=1) {
                converted.unshift(number%2);
                number = Math.floor(number/2);
            }

            return converted;
        }

        res.end();
});

// -------- Binary Segment Checker -BinaryGap --------------------------------------------------------------------------

// -------- Count the number of different ways of climbing to the top of a ladder --------------------------------------

app.get('/ifilx', function(req, res){


    function getCode(){

    var A =[1,2,5,9,9];
    var X = 10;    
    var N = A.length;
    if (N === 0) {
         console.log(-1);
    }
    var l = 0;
    var r = N-1;
    while (l < r) {
        var m = Math.floor((l + r) / 2);
        if (A[m] > X) {
            r = m - 1;
        } else {
            if(A[m] == X){ return m; break; } l = m + 1;
        }
    }
    if (A[l] == X) {
        return l;
    }

    return -1;

}

console.log(getCode());

res.end();

});

// -------- Count the number of different ways of climbing to the top of a ladder --------------------------------------

// -------- Depth <UL> <LI> count --------------------------------------------------------------------------------------

app.get('/wordcount', function(req, res){
    res.render(__dirname + '/public/ullicount');
});

// maxdepth = 0
// $('li').each(function(li) {
//  	var parentArray = [];
//    var sParents = $(this).parents("ul, ol").map(function() {                
//       parentArray.push(this.tagName);
//     })
//     var depth = parentArray.length;
//     if (depth > maxdepth) { maxdepth = depth };
// });

// -------- Depth <UL> <LI> count --------------------------------------------------------------------------------------

// ----------------------------- You have to climb up a ladder ---------------------------------------------------------

app.get('/lader', function(req, res){

    var A = [4,4,5,5,1];
    var B = [3,2,4,3,1];

    var n = 4;

        
    // if(n == 1 || n== 2 || n== 3) z=n;

    for(var j=0; j<A.length; j++)
    {
        var z = 2;
        if(A[j] == 1 || A[j] == 2) z=A[j];
        for(var i=2; i<A[j]; i++)
        {
        z = z + (A[j]-i); 
        }
        console.log(z % (Math.pow(2, B[j])));
    }

        res.end();
    
    // f(n) = k(n-1) + k(n-2) + k(n-3) + k(n-4);
});


// ----------------------------- You have to climb up a ladder ---------------------------------------------------------

// ----------------------------- Server Listen and Configuration ---------------------------------------------------------

http.listen(8080);
console.log("Server Start on given port:8080");

// ----------------------------- Server Listen and Configuration ---------------------------------------------------------

// ####################################################################################################################
// ########################################### Interview Algorithm ####################################################
// #################################################################################################################### 