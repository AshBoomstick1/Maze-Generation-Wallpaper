let map = [];
let pos_data = [];
let info_data = [];
let path_list = [[0, 0]];
let dead_ends = [];

let currentX = 0;
let currentY = 0;

let oldX = 0;
let oldY = 0;

let cols = 0;
let rows = 0;

let next_func = "new_tile";

let frame = 0;
let printed_frames = 0;

let size = 40;

let possible_tile_color = "yellow";
let path_color = "#ff8000ff";
let current_tile_color = "blue";
let dead_tile_color = "yellow";
let background_color = "white";


//kquitapp6 plasmashell && kstart plasmashell


function next_frame()
{
  if (path_list.length > 10 && currentX == 0 && currentY == 0)
  {
    dimensionChanged(cols, rows, size);
  }
  else if (cols != 0)
  {
    frame += 1;
    if (next_func == "new_tile")
    {  
        new_tile();
    }
    else
    {
        find_new_intersection();
    }
  }
}


function dimensionChanged(width,height, config) {

  size = config.tile_scale;
  if (cols != width)
  {
    cols = Math.floor(width / size) + 1;
    rows = Math.floor(height / size) + 1;
    background_color = config.background_color;
    path_color = config.path_color;
    possible_tile_color = config.possible_tiles_color;
    current_tile_color = config.current_tile_color;
  }

  map = [];
  pos_data = [];
  info_data = [];
  path_list = [[0, 0]];
  dead_ends = [];

  currentX = 0;
  currentY = 0;

  oldX = 0;
  oldY = 0;

  for (let x = 0; x < rows; x++)
  {
    for (let y = 0; y < cols; y++)
    {
      if (y % 2 == 0 && x % 2 == 0)
      {
        map.push(possible_tile_color);
      }
      else
      {
        map.push("  ");
      }
    }
  }

  //preparing raw map for printing
  let compiledTileMap = packageTileMap(map); //compiles the map into the position data and the charactar data

  pos_data = compiledTileMap[0]; //sets the position data as its own variable
  info_data = compiledTileMap[1]; //sets the info data as its own variables, the actual information that will be printed

  replace_data(0, 0, current_tile_color);

  next_func = "new_tile";
}



function packageTileMap(data)
{
  for (let row = 0; row < rows; row++) //keeps track of the row
  {
    for (let col = 0; col < cols; col++) //keeps track of what tile in that row
    {
      if (data[(row * cols) + col] != "  ") //if that tile is filled, add the pos and data info
      {
        pos_data.push([col, row]); //adds the positons
        info_data.push(data[(row * cols) + col]); //adds the data that will be printed
      }
    }
  }

  return [pos_data, info_data];
}



function printFrame(ctx, width, height, config)
{

  if (size != config.tile_scale || background_color != config.background_color || path_color != config.path_color || possible_tile_color != config.possible_tiles_color || current_tile_color != config.current_tile_color)
  {
    dimensionChanged(width, height, config);
  }

  let tileIdx = 0; //the index of all the tiles that will be printed

  for (let row = 0; row < rows; row++) //prints each row
  {
    for (let col = 0; col < cols; col++) //prints each tile (col)
    {
      if (pos_data[tileIdx][0] == col && pos_data[tileIdx][1] == row) //checks if the next tile has the coordinates of this tile
      {
        ctx.fillStyle = info_data[tileIdx];
        ctx.fillRect(col*size,row*size,size,size);
        tileIdx += 1; //increases the index, moving the target to the next tile
      }
      else if (frame != 0 || frame != 1)
      {
        ctx.fillStyle = background_color;
        ctx.fillRect(col*size,row*size,size,size);
      }
    }
  }
}

//adds an unpackaged piece of new data and inerts it into the proper spot in already compiled info_data and pos_data vecs
//x and y are the coordinates of the new data
//data is the new data that will be printed
function insert_data(x, y, data)
{
  //std::cout << "THIS COORD: (" << x << ", " << y << ")\n"; 
  for (let i = 0; i < pos_data.length - 1; i++)
  {
    //std::cout << "CHECKING AT THIS IDX: " << i << " (" << pos_data[i][0] << ", " << pos_data[i][1] << ") --- (" << pos_data[i + 1][0] << ", " << pos_data[i + 1][1] << ")\n";

    if (y != pos_data[i][1] && y == pos_data[i + 1][1] && x < pos_data[i + 1][0]) //checks if this is the first thing in the row
    {
      pos_data.splice(i + 1, 0, [x, y]);
      info_data.splice(i + 1, 0, data);
      i = pos_data.length;
    }
    else if (y != pos_data[i][1] && y < pos_data[i + 1][1])
    {
      pos_data.splice(i + 1, 0, [x, y]);
      info_data.splice(i + 1, 0, data);
      i = pos_data.length;
    }
    else if (pos_data[i][1] == y && pos_data[i + 1][1] != y) //hecks if this is the last
    {
      pos_data.splice(i + 1, 0, [x, y]);
      info_data.splice(i + 1, 0, data);
      i = pos_data.length;
    }
    else if (pos_data[i][1] == y)
    {
      if (pos_data[i][0] < x && pos_data[i + 1][0] > x) //checks if this is the correct position in this row
      {
        pos_data.splice(i + 1, 0, [x, y]);
        info_data.splice(i + 1, 0, data);
        i = pos_data.length;
      }
    }
  }
}


function remove_data(x, y) //removes a data point in both info_data and pos_data, same arguments at intering
{
  for (let i = 0; i < pos_data.length; i++) //loops through each row
  {
    if (pos_data[i][0] == x && pos_data[i][1] == y)
    {
      pos_data.splice(i, 1); //removes the data
      info_data.splice(i, 1);
      i = pos_data.length;
    }
  }
}


function move_data(currentX, currentY, newX, newY, newData) //moves one data form one position to another while also allowing the changeing of its appreaence
{
  remove_data(currentX, currentY);
  insert_data(newX, newY, newData);
}

function replace_data(x, y, newData) //replaces the data at one coordinate with new information
{
  for (let i = 0; i < pos_data.length; i++)
  {
    if (pos_data[i][0] == x && pos_data[i][1] == y)
    {
      info_data[i] = newData;
    }
  }
}


function search_coord_vec (x, y, vec)
{
  for (let i = 0; i < vec.length; i++)
  {
    if (vec[i][0] == x && vec[i][1] == y)
    {
      return true;
    }
  }
  return false;
}

function available_tile(x, y)
{
  if (search_coord_vec(x, y, path_list) == false && search_coord_vec(x, y, dead_ends) == false)
  {
    if (x >= 0 && x <= cols - 1)
    {
      if (y >= 0 && y <= rows - 1)
      {
        return true;
      }
    }
  }
  return false;
}


function find_new_intersection()
{

  replace_data(currentX, currentY, path_color);


  let possible_tiles = []; 
  let empty_tiles = [];

  //possible
  if (available_tile(currentX - 1, currentY) == false && available_tile(currentX - 2, currentY) == false && currentX - 1 >= 0) //check left
  {
    possible_tiles.push([currentX - 2, currentY]); //adds the coordinates to available tiles
  }

  if (available_tile(currentX + 1, currentY) == false && available_tile(currentX + 2, currentY) == false && currentX + 1 <= cols - 1) //check right
  {
    possible_tiles.push([currentX + 2, currentY]);
  }

  if (available_tile(currentX, currentY + 1) == false && available_tile(currentX, currentY + 2) == false && currentY + 1 <= rows - 1) //check up
  {
    possible_tiles.push([currentX, currentY + 2]);
  }

  if (available_tile(currentX, currentY - 1) == false && available_tile(currentX, currentY - 2) == false && currentY - 1 >= 0) //check down
  {
    possible_tiles.push([currentX, currentY - 2]);
  }




  //empty
  if (available_tile(currentX - 1, currentY) == true && available_tile(currentX - 2, currentY) == true && currentX - 1 >= 0) //check left
  {
    empty_tiles.push([currentX - 2, currentY]); //adds the coordinates to available tiles
  }

  if (available_tile(currentX + 1, currentY) == true && available_tile(currentX + 2, currentY) == true && currentX + 1 <= cols - 1) //check right
  {
    empty_tiles.push([currentX + 2, currentY]);
  }

  if (available_tile(currentX, currentY + 1) == true && available_tile(currentX, currentY + 2) == true && currentY + 1 <= rows - 1) //check up
  {
    empty_tiles.push([currentX, currentY + 2]);
  }

  if (available_tile(currentX, currentY - 1) == true && available_tile(currentX, currentY - 2) == true && currentY - 1 >= 0) //check down
  {
    empty_tiles.push([currentX, currentY - 2]);
  }

  if (currentX == 0 && currentY == 0 && path_list.length > cols + rows)
  {
  }
  else if (empty_tiles.length == 0)
  {
    if (possible_tiles.length == 1)
    {
      oldX = currentX;
      oldY = currentY;
      currentX = possible_tiles[0][0];
      currentY = possible_tiles[0][1];
      replace_data(currentX, currentY, current_tile_color);
      next_func = "intersection";
    }
    else
    {
    for (let i = 0; i < possible_tiles.length; i++)
    {
      if (search_coord_vec(possible_tiles[i][0], possible_tiles[i][1], dead_ends) == false && (possible_tiles[i][0] != oldX || possible_tiles[i][1] != oldY))
      {
        oldX = currentX;
        oldY = currentY;
        currentX = possible_tiles[i][0];
        currentY = possible_tiles[i][1];
        replace_data(currentX, currentY, current_tile_color);
        next_func = "intersection";
        i = possible_tiles.length;
      }
    }
    }
  }
  else if (empty_tiles.length == 1)
  {
    dead_ends.push([oldX, oldY]);
    oldX = currentX;
    oldY = currentY;
    currentX;
    currentY;
    next_func = "new_tile";
  }
  else if (empty_tiles.length == 2)
  {
    dead_ends.push([oldX, oldY]);

    if (Math.floor(Math.random() * 2) == 0)
    {
      oldX = currentX;
      oldY = currentY;
      currentX;
      currentY;
      next_func = "new_tile";
    }
    else
    {
      oldX = currentX;
      oldY = currentY;
      currentX;
      currentY;
      next_func = "new_tile";
    }
  }
}


function new_tile() //finds the next tile in the maze
{
  replace_data(oldX, oldY, path_color);
  replace_data(currentX, currentY, path_color);


  let available_tiles = []; //finds every horizontally or vertically adjacent tile that is not occupied {{x, y}, {x, y}}
  let between_tiles = []; //every tile inbetween each available tile and the current tile
  //finds and fills available tiles & between tiles
  if (available_tile(currentX - 2, currentY)) //check left
  {
    available_tiles.push([currentX - 2, currentY]); //adds the coordinates to available tiles
    between_tiles.push([currentX - 1, currentY]); //adds the coordinates to between tiles
  }

  if (available_tile(currentX + 2, currentY)) //check right
  {
    available_tiles.push([currentX + 2, currentY]);
    between_tiles.push([currentX + 1, currentY]);
  }

  if (available_tile(currentX, currentY + 2)) //check up
  {
    available_tiles.push([currentX, currentY + 2]);
    between_tiles.push([currentX, currentY + 1]);
  }

  if (available_tile(currentX, currentY - 2)) //check down
  {
    available_tiles.push([currentX, currentY - 2]);
    between_tiles.push([currentX, currentY - 1]);
  }


  //finds a random number that coordisponds to the idx of an available tile in the available tiles list;
  let rand_int = 0;

  if (available_tiles.length == 0)
  {
    rand_int = 4;
  }
  else
  {
    rand_int = Math.floor(Math.random() * available_tiles.length);
  }
  
  switch (rand_int)
  {
  case 0:
    path_list.push(available_tiles[0]); //adds the chosen available tile to the path list
    path_list.push(between_tiles[0]); //adds the inbetween tile, is only important for printing and preserving matching idx between path list and pos_data
    insert_data(between_tiles[0][0], between_tiles[0][1], path_color); //adds the between tile to be printed
    oldX = currentX;
    oldY = currentY;
    currentX = available_tiles[0][0];
    currentY = available_tiles[0][1];
    replace_data(currentX, currentY, current_tile_color);
    next_func = "new_tile";
    break;
  
  case 1:
    path_list.push(available_tiles[1]);
    path_list.push(between_tiles[1]);
    insert_data(between_tiles[1][0], between_tiles[1][1], path_color);
    oldX = currentX;
    oldY = currentY;
    currentX = available_tiles[1][0];
    currentY = available_tiles[1][1];
    replace_data(currentX, currentY, current_tile_color);
    next_func = "new_tile";
    break;

  case 2:
    path_list.push(available_tiles[2]);
    path_list.push(between_tiles[2]);
    insert_data(between_tiles[2][0], between_tiles[2][1], path_color);
    oldX = currentX;
    oldY = currentY;
    currentX = available_tiles[2][0];
    currentY = available_tiles[2][1];
    replace_data(currentX, currentY, current_tile_color);
    next_func = "new_tile";
    break;

  case 4:
    next_func = "intersection";
    break;

  case 5:

    break;
  }

  
}