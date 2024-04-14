# TCSG (Tailwind Components Snippet Generator)

TCSG is a Visual Studio Code extension designed to streamline the development workflow for Tailwind CSS projects. This extension provides ready to go component snippets easily customizable within the Tailwind CSS framework.

## Features

**NEW: Initialize Project**: Get coding as soon as possible with the basics taken care of for you. The dependancies included for a new project are:

- _tailwindcss_
- _prettier_: to format your project in a conventional way.
- _prettier-plugin-tailwindcss_: to keep a conventional order for your TailwindCSS classes.
- _clean-css-cli_: to minify your CSS code to improve performance.
- _terser_: to minify/uglify your JS code to improve performance.

**Snippet Insertion**: Quickly insert pre-defined Tailwind CSS component snippets from the click of a button, or the snippet prefix, into your HTML and JavaScript files, improving your development speed and consistency. The components included are:

- Button (Primary, Disabled)
- Navbar (Text based, Image based)
- Image gallery
- Modal (Viewport centered, Fullscreen)
- More coming soon...

**Build your project with the click of a button**: Compile your Tailwind CSS using a custom build command that respects your project's specific configuration, directly from within VSCode.

## How to use

**NEW: Initialize Project**:

1. Open the TCSG Snippets view on the left panel.
2. Select Input and Output files for the current project to compile Tailwind CSS. This is done with the "TCSG: Select Input/Output Files" command, or with the first icon that appears in the view.
3. Install the basic dependancies and create a package.json file with the "TCSG: Initialize Project" command, or with the second icon that appears in the view.
4. Configure the generated tailwind.config.js file to include all your sources for Tailwind CSS to compile in the output file.
5. Configure the terser script to include your Javascript source for minifying.
6. When ready, build the project (compile Tailwind CSS, minify CSS, and minify JS) with the "TCSG: Build Project" command, or with third icon that appears in the view.
7. OPTIONAL: If you want to clear the Input/Output file for the current project, use the "TCSG: Clear Input/Output Files" command, or the fourth icon that appears in the view.

   ![Commands image](./img/commands.png)

**Snippet Insertion**:

1. Open the TCSG Snippets view on the left panel.
2. In a JavaScript or HTML file, insert the snippets by selecting the desired one inside the Tree View. For example, if I wanted to insert a centered modal component, I should follow the next steps:

   - In my HTML file, click on the HTML Snippets dropdown, and select the "Centered Modal" option.
   - In my JavaScript file, click on the Javascript Snippets dropdown, and select the "Centered Modal" option.
   - Keep in mind you have to include both of these files inside the source files for your Tailwind CSS configuration files.

   ![Snippets image](./img/snippets.png)

3. With these steps, you have correctly inserted the "Centered Modal" component.

## License

Distributed under the MIT License. See LICENSE for more information.
