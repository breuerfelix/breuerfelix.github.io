---
layout: post
title: How to inspect a Python API
date: 2020-03-01 11:00:00 +01:00
modify_date: 2020-03-02 11:00:00 +01:00
tags: python api inspect dynamic
category: tutorial
---

Imagine the following situation: There is a fancy, large, often-changed Python API which is used sequentially and you want to expose it to your favorite users via a pretty user interface.
```python
class FancyAPI:
    def cleans_room(self, room: str):
        """Cleans given room for you. You should call it every day."""
        pass

    def bake_pizza(self, size: int, flavor: str):
        """Even this function got a docstring"""
        pass
```
<!--more-->

You could create a window where the user can select the function they want to execute. Based on this function, you also create a modal so the user can input the size and flavor or the desired room as inputs for the function.  
For every function, you need to program a new modal because the inputs and types are different.  
If these functions get more parameters or the type changes, the modals have to be updated by you.

This is really easy if you only have 2 functions. Now imagine such an API class with 50 functions, each containing 6 parameters. I would not want to maintain that.

I want to show you how to extract all the needed information to build a dynamic view based on the given class.

```python
# inspect is a default python package
# no need to install it
from inspect import signature, getdoc

# create an instance of the desired api class
instance_to_inspect = FancyAPI()

real_functions = []
# dir() function loops over all functions of that class
for func in dir(instance_to_inspect):

    # ignore all internal Python functions
    if func.startswith('__') and func.endswith('__'):
        continue

    # this is a 'real' implemented function
    real_functions.append(func)

# actions represent all API functions the user can use
actions = []

for func in real_functions:
    action = dict()

    # getattr() extracts all information based on the function name
    function = getattr(instance_to_inspect, func)

    action['functionName'] = func
    # getdoc() extracts the docstring
    action['description'] = getdoc(function)

    params = []

    # signature extracts all function parameters
    sig = signature(function)

    for index, para in enumerate(sig.parameters):
        # ignore 'self' parameter
        if index == 0:
            continue

        actual_param = sig.parameters[para]
        param = dict()

        param['name'] = str(para)

        # get the name of the type e.g. 'str' or 'int'
        param['type'] = actual_param.annotation.__name__

        params.append(param)

    action['params'] = params

    actions.append(action)

# actions contains a list of all functions
# and their parameters
actions
```

In our example, the variable `actions` now contains a JSON-like dict which looks like the following:
```json
[{
    "functionName": "cleans_room",
    "description": "Cleans given room for you. You should call it every day.",
    "params": [
        {
            "name": "room",
            "type": "str"
        }
    ]
},
{

    "functionName": "bake_pizza",
    "description": "Even this function got a docstring",
    "params": [
        {
            "name": "size",
            "type": "int"
        },
        {
            "name": "flavor",
            "type": "str"
        }
    ]
}]
```

Now it is time to display the extracted information to the user. I made some JavaScript for that in my recent project. Feel free to have a look at the [GitHub folder](https://github.com/breuerfelix/instapy-gui/tree/master/src/sites/configuration/components).  
I will not go into detail because this would be out of the scope of this little post.

![sample function screenshot](/assets/images/sample_function.png)

In the last step, we have to read out the user's configuration and call each function dynamically based on the function name.  
Arguments are passed via parameter name.

```python
# these jobs will be read in from a database
jobs = [{
    "functionName": "cleans_room",
    "params": [
        {
            "name": "room",
            "value": "kitchen"
        }
    ]
}]

for job in jobs:
    arguments = dict()
    # create a dict with all params
    for param in job['params']:
        arguments[param['name']] = param['value']

    # actually calling the function by its name
    # passing all params as a dict via kwargs
    getattr(session, job['functionName'])(**arguments)
```

This use case is a little special because we can ignore return values and nested functions.

I still think it is really handy because right now even people who are not able to write Python code can interact with a library through the browser, for example.

And you know what is the best?  
If the API changes, you just have to re-run the script and everything is up-to-date!
