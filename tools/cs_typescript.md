---
layout: page
title: TypeScript CheatSheet
---

```typescript
// Compile
tsc tstut.ts --target ES5
tsc *.ts --watch --target ES5

// types: string / number / boolean / any
var myName: string = "felix";
const PI = 3.14156;

typeof(var);

var strToNum: number = parseInt("5");
var string: string = strToNum.toString();

// let creates a variable for this block
// example: for loops
let sampleLet = 123;

// convert
String(5);
Number("4");
var message: string = ${number};

// arrays
var employees: string[] = ["Bob", "Sally"];
employees.push("Felix");
var superheroes: SuperHero[] = [];
superheroes[0].realName = "Test";

// interfaces
interface SuperHero{
    realName: string;
    superName: string;
    age: number;

    fight(): any;
}

var superMan: SuperHero = {
    realName = "Clark Kent",
    superName = "Superman",
    age = 56
}

// loops
for(var val in randArray){} //val = index number
for(var val of randArray){} //val = object in the array

// functions
var getSum = function(num1: number, num2: number): number{ return num1 + num2; }
var getSum = function(num1: number, num2 = 2, num3?: number): number{
    if(typeof num3 !== 'undefined') // num3 is a value
}
var sumAll = function(...nums: number[]): void{
    var sum = nums.reduce((a, b) => a + b, 0);
} // sumAll(1,2,3,4);
var addOne = (x) => x + 1; // "5 + 1 =" + addOne(5);

// classes
class Animal{
    public favFood: string;
    static numOfAnimals: number = 0;
    constructor(private name: string, private owner: string){
        Animnal.numOfAnimals++;
    }

    ownerInfo(){
        //this.name -> get name of Animal
    }

    static howManyAnimals(): number{
        return Animal.numOfAnimals;
    }

    private _weight: numner;

    get weight(): number{ return this._weight; }
    set weight(weight: number){ this._weight = weight; }
}

var sport = new Animla("Spot", "Felix");
spot.ownerInfo();
spot.weight = 100; // calls the setter
var num = spot.weight; // calls the getter

class Dog extends Animal{
    constructor(name: string, owner: string){
        super(name, owner);
        Dog.numOfAnimals++;
    }
}

var grover = new Dog("Grover", "janine");
(grover instanceof Animal) // true if inherit
('name' in grover) // field exists in Dog

// generic functions
function GetType<T>(val: T): string{
    return typeof(val);
}

functions getWheels<w extends Vehicle>(veh: w): number{
    return w.wheels;
}
```
