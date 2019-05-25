---
layout: page
title: goLang CheatSheet
---

```go
package main

import(
    "package"
)

var a := 12 // automatic
var b int = 12 // specific

"'
string line 1
string line 2
'"

x := 13
a := &x // a = address of x
*a = 4 // pointer to address and changes it's value

int("23") // convert

grades := make(map[key]value) // dictionaries
grades["felix"] = 43 // adding new keys

grade:= grades["Felix"] // accessing a dict
delete(grades, "Felix") // delete key

for i := 4 {} // foreach
for _, Location := range Location // range returns all indexes

type car struct {
    gas_pedal int
    x
    y
}

func (c car) name() return {
    // reference the car with c.
}

mer := car { value1, value2 or x: 12, y: 12 }

func name(x string, y number) number {

}

func name(x,y string) (string, string) // return tuple

go func() // starts function in a lightweight thread

// syncing threads
var wg sync.WaitGroup

wg.Add(1);
wg.Wait()
wg.Done()

defer func // executes function in the end
panic("test") // exception

r := recover() //if r != nill -> there was a panic

// channel
channel := make(chan int)

c chan
c <- 5 // write into channel

x := <- c // recieve from channel

close(channel)
```
