#!/bin/bash

echo "Welcome to NestJS Generator Script"
echo "Please choose what you want to generate (you can choose multiple options separated by spaces):"
echo "1) Module"
echo "2) Controller"
echo "3) Service"
echo "4) Class"
echo "5) Pipe"
echo "6) Filter"
echo "7) Middleware"
echo "8) Guard"
echo "9) Resolver"
echo "10) Resource"
echo "11) Gateway"
echo "12) Decorator"
echo "13) Interface"

read -p "Enter your choices (e.g., 1 3 5): " choices
read -p "Enter the name for the element(s): " name
read -p "Enter the path (optional, leave blank for default): " path

for choice in $choices
do
    case $choice in
        1)
            schematic="module"
            ;;
        2)
            schematic="controller"
            ;;
        3)
            schematic="service"
            ;;
        4)
            schematic="class"
            ;;
        5)
            schematic="pipe"
            ;;
        6)
            schematic="filter"
            ;;
        7)
            schematic="middleware"
            ;;
        8)
            schematic="guard"
            ;;
        9)
            schematic="resolver"
            ;;
        10)
            schematic="resource"
            ;;
        11)
            schematic="gateway"
            ;;
        12)
            schematic="decorator"
            ;;
        13)
            schematic="interface"
            ;;
        *)
            echo "Invalid choice: $choice"
            continue
            ;;
    esac
    
    if [ -z "$path" ]; then
     npx   nest g $schematic $name
    else
       npx nest g $schematic $name $path
    fi
done

echo "Generation complete!"
