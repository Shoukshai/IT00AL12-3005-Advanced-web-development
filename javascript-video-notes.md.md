1. A welcoming video, they assume we have some knowledge of others languages. Everyone presents themselves.
2. A description of JavaScript, according to 2019 it's the most used language in the world, it's used everywhere
3. To run js on server we need node.js, it's an introduction video to node.js
4. A video to setup our vscode with 3 extensions and nvm to manage node.js
5. Setp by setp video on how to install and setup them
6. Explanation on how `console.log()` works, it's similar to most language.
7. A video on comments in js, it's better to do function to self-document the code instead of using them
8. Example based on the previous video
9. Explanation on declaring variables with `var`, `let` and `const` even tho `var` is not used anymore and we should use `const` the most
10. Example based on the previous video
11. Explanation on combining strings with the `+` operator, it seem confusing with numbers and they recommend to use the same datatype only
12. Example based on the previous video with the exact same code, they just show the runtime? (that we can run ourself)
13. Differences in formatting strings with console.log exaample (video 6 explains a bit of that aswell)
14. Example based on the previous video
15. List of datatype in js, not a lot compared to others strongly typed languages, the example given is confusing. We should use triple "=" to type safe compares 
16. Example based on the previous video, an array is an object for js, `instanceof` check based on the constructor
17. Simple math explanation video, we should use the math object instead for complexes operations
18. Example based on the previous video, she reads her code
19. To convert numbers to string we should use `toString()` to avoid any issues
20. Example based on the previous video, she reads her code
21. Explanation on `try . . catch`, nothing to point out.
22. Example based on the previous video, she reads her code
23. Time is an object, everything is stored since the first of January 1970 (like windows file I think), there a date constructor: `new Date ()`, there a set list and months starts at 0, which is like array in most of languages. To get values, we can `get.` them
24. Example based on the previous video, date is really simple to understand and code
25. Js automatically convert data, double "=" convert, triple "=" doesn't, in video 15 they talks about it, same for `!=` and `!==`. If we write single line `if` statement we can ignore bracket, we shouldn't because it's less readable. They introduce the ternary operator
26. Example based on the previous video, repeat that we shouldn't uses double "=" even if it's more convenient and since we are the one that write the code it doesn't really matters if no one is gonna touch it anyway after
27. There implicit boolean value like C or other languages (they say python). They say that we shouldn't look at negative and we should look at positive which is a false statement, to not nest everything, we should look at negative. We should use double comparison operator in most cases.
28. Example based on the previous video, they showcase the `switch`.
29. Introduction to arrays, nothing to mention
30. Example based on the previous video, she reads her code
31. We can add data based on index, it starts at 0. To print something inside an array we use: `console.log(arr[x])`, if we substract the length by 1 we get the last item in the array
32. Example based on the previous video, she reads her code
33. We can use `push(value)` and `pop()` to affect the end of the array and `shift()` and `unshift(value)` to affect the front.
34. Example based on the previous video, she reads her code
35. It's an introduction to loops, `for` and `while` loop are similar. `For . . . of` are used to iterate through arrays for example.
36. He shows how to construct loop and the use cases.
37. They introduce us to function which are used to avoid copy pasting multiples times the same code by abstracting it. It's easier to modify aswell. They showcase the syntax after.
38. They showcase the usage of function and how to  call it in `console.log`
39. An introduction to arrow function which are function but with a variable assignation. It's simpler and better. Single line function will return implicitly the result.
40. He showcase the arrow function with an add function and the implicite return. To make multi lines function you still needs "{ }"
41. She introduce JSON which is a filetype to store data for js, it uses "[ ]" to define the data and we can parse the data to object
42. More of `typeof` again, this time with JSON, she shows how to convert an object to a string then parsing it back.
43. Objects can have properties + methods. You can create one with `new Object()` but realistically you’ll use "{ }" (object literal). `window` and `globalThis` are global objects
44. You can clearly see object creation and property/method access with dot notation.
45. Promises are used for async stuff like API calls or I/O.
46. He wraps `setTimeout` into a promise, then uses `.then()` to run code after it resolves. From my understanding, promises are also heavily used for error handling in async operations.
47. He showcase `await` that waits for a promise to resolve inside an `async` function.
48. He shows how `async` + `await` work together to make async code look synchronous. Also: `await` only works inside an `async` function.
49. You can bundle your code and publish packages to the npm registry. (I think people use pnpm now)
50. He imports `express` as a dependency instead of copying code.
51. He thanks us for watching the guide entirely and then invites us to go through the github repo to learn more. He invites us to start our own code.