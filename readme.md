Let's make a Tetris!

tetris, with N-players (click new player)

Click to equip your bomb.  Click again to blow up a section of your play field.

Resize your playfield with the Resize button.  Layout starts to have problems at around 100x100.

Add new custom Tetromino shapes with the "create shape" button

There are a **LOT** of commits on this project.  These would normally exist on a development branch, then be consolidated and tidied before merging with Main.


[Project board](https://github.com/users/DBBrowne/projects/1)

[Initial designs](https://github.com/DBBrowne/ga-sei-projectone/wiki/initial-layouts)

[Deployed Here!](https://dbbrowne.github.io/ga-sei-projectone/)

Tetronimos:
<figure class="pi-item pi-image" data-source="image">
	<a href="https://static.wikia.nocookie.net/tetrisconcept/images/c/ca/Tetromino_image.png/revision/latest?cb=20090706171943" class="image image-thumbnail" title="">
		<img src="https://static.wikia.nocookie.net/tetrisconcept/images/c/ca/Tetromino_image.png/revision/latest/scale-to-width-down/350?cb=20090706171943" srcset="https://static.wikia.nocookie.net/tetrisconcept/images/c/ca/Tetromino_image.png/revision/latest/scale-to-width-down/350?cb=20090706171943 1x, https://static.wikia.nocookie.net/tetrisconcept/images/c/ca/Tetromino_image.png/revision/latest/scale-to-width-down/700?cb=20090706171943 2x" class="pi-image-thumbnail" alt="" data-image-key="Tetromino_image.png" data-image-name="Tetromino image.png" width="270" height="90">
	<figcaption class="pi-item-spacing pi-caption">The various types of tetrominoes, from tetris.fandom.com</figcaption>
  </a>
</figure>


Big challenges - 

retaining square playfield cells at all zoom levels and window sizes.  Easy to get something that looked ok with either 
  - fixed pixel size of cells (not resposneive to screen size or playfield size))
or 
  - cells that resize, but do not stay square.

Solution was a few failed attempts with JS before allowing flexbox to set cell width, and js to apply cell width to cell height.