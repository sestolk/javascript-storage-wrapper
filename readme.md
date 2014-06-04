# Storage wrapper for localStorage

## Story of origin
This is a class I wrote that makes it easier to maintain a localStorage database. It will automaticly convert Objects or Arrays to JSON format which will then be saved in the localStorage.
It also keeps record of what you added to the localStorage via a so called index. This index is also automaticly maintained and can be called upon to see what is stored.
You are also able to create multidimensional (2-levels) items in the storage, as you might recognize from languages like PHP.

## Environments in which to use
* [Cordova Apps](http://cordova.apache.org/) on mobile devices

# Installation
Check the included [index.html](../index.html) for a live example and installation. It is fairly straightforward, but If you really don't know. You know where to find me!

# Usage

## Available methods
Below you will find some examples of the available methods.

### Initialize
Construct a new Storage

Examples:
```
	var storage = new Storage('your-storage-name');
```

### .get()
Retrieves a single item from the storage

Examples:
```
// Plain string returned
storage.get('session.username');

// or Parsed as JSON
storage.get('session.username', true);
```

### .getGroup()
Retrieves an entire group from the storage

Examples:
```
// Items are always parsed as JSON
storage.getGroup('session');
```

### .set()
Adds a new item to the storage

Examples:
```
storage.set('session.username', 'Sven');
```

### .remove()
Removes an item from the storage

Examples:
```
storage.remove('session.username');
```

### .removeGroup()
Removes an entire group from the storage

Examples:
```
storage.removeGroup('session');
```

### .removeAll()
Removes everything from the localStorage and clears the storage index

Examples:
```
storage.removeAll();
```


## Future update(s)
* Nothing so far

## Ignored feature(s)
The features will be ignored as they are simply to complex to build in Javascript.
* Nothing so far

### Author(s)
* Sven Stolk
  * Usability Laboratory