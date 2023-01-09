# General Overview

The fetching works. I can get all the previous katas for a given user
Using the "Apply Filters" button isn't triggering a re-render like I'd like it to.
It needs to in order to change what data is being sent to the KataList component.

Similarly, the Up/Down arrows are re-rendering too much!
They should simply cycle the data that's already available in the component.