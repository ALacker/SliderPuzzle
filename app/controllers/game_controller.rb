class GameController < ApplicationController

    # initialize the game, generate an array of the size
    # size is an integer saying how wide and tall the grid will be
    def initialize()
        @grid = []
        @blankLocation = 0
        @size = 3

        # generate a matrix of given size
        for x in 0 ... @size * @size
            @grid[x] = x
        end

        newGame()
    end
    
    # creates a new game and finds the optimal solution
    def newGame()
    	scrambleGrid()
        g = @grid.dup
        @s = solve()
        print @s
        setGrid(g)
    end

    # set the game Grid equal to array
    def setGrid(array)
        @grid = array
        @blankLocation = @grid.index(0)
    end

    # canGoDirection says whether you can go in a direction
    # swapIndex indicates the direction you want to go in
    #   0: left
    #   1: up
    #   2: right
    #   3: down
    def canGoDirection(swapIndex)
        case swapIndex
        when 0
            return (@blankLocation % @size != 0)
        when 1
            return (@blankLocation >= @size)
        when 2
            return (@blankLocation % @size != @size - 1)
        when 3
            return (@blankLocation < @size * (@size - 1))
        end
        return false
    end

    # swapCells exchanges the blank space with an adjacent cell
    # swapIndex indicates which cell you exchange the blank space with
    #   0: left
    #   1: up
    #   2: right
    #   3: down
    def swapCells(swapIndex)
        case swapIndex
        when 0
            swapCell = @blankLocation - 1
        when 1
            swapCell = @blankLocation - @size
        when 2
            swapCell = @blankLocation + 1
        when 3
            swapCell = @blankLocation + @size
        end

        temp = @grid[@blankLocation]
        @grid[@blankLocation] = @grid[swapCell]
        @grid[swapCell] = temp
        @blankLocation = swapCell
    end

    # display the grid in the terminal
    def printGrid()
        print "\n"
        #print the generated matrix
        for x in 0 ... @size
            for y in 0 ... @size
              print @grid[x * @size + y]
            end
            print "\n"
        end
    end

    # randomize the location of the numbers in the grid
    def scrambleGrid()
        numberOfMoves = 100 * @grid.size
        for x in 0 .. numberOfMoves
            direction = rand(4)
            if (canGoDirection(direction))
                swapCells(direction)
            end
        end
    end

    # distanceToFinish defines a heuristic that indicates 
    # how far the current grid is from the solution
    # returns the estimated distance (number of swaps) to the goal state
    def distanceToFinish()
        distance = 0

        xloc = 0
        yloc = 0
        for i in 0 ... @grid.size
            if (@grid[i] != 0)
              goalLoc = @grid[i] - 1
              xloc = i % @size
              yloc = (i / @size).floor
              xgoalloc = goalLoc % @size 
              ygoalloc = (goalLoc / @size).floor
              distance += (xgoalloc - xloc).abs + (ygoalloc - yloc).abs
            end
        end
        return distance;

    end

    # use the A* algorithm to find an optimal solution to the puzzle
    # returns the lowest number of moves possible to find a solution
    def solve()
        openSet = Containers::PriorityQueue.new # the layouts that have not yet been checked
        openSet.push([@grid.dup, 0], distanceToFinish()) # start with the original layout

        closedSet = [] # an array of game layouts that have already been evaluated

        while openSet.size > 0

            # get a new path from the set
            setItem = openSet.pop

            # search the surrounding tiles for walkable choices
            for direction in 0 .. 3
                path_cost = setItem[1]  # get the path cost to the current layout
                setGrid(setItem[0].dup) # change the layout to be the one we just got from the set
            
                if canGoDirection(direction)
                    swapCells(direction)
                    path_cost += 1
                    cost = path_cost + distanceToFinish() # the estimated cost for going this direction
              
                    if (distanceToFinish() == 0) # found the solution
                        return path_cost
                    end
                    if (!closedSet.include? @grid) # if the layout has not been evaluated, add it to the set
                        closedSet << @grid.dup
                        openSet.push([@grid.dup, path_cost], 0 - cost)
                    end
                end
            end
        end
    end
end
