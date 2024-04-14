# Changelog

All notable changes to the "TCSG" extension will be documented in this file.

## [1.1.0] - 2024/04/14

### Added

- The initProject command to initialize a project with some quality of life dependancies to get you started when creating a new Tailwind CSS project. The dependancies include:

  - _tailwindcss_
  - _prettier_: to format your project in a conventional way.
  - _prettier-plugin-tailwindcss_: to keep a conventional order for your TailwindCSS classes.
  - _clean-css-cli_: to minify your CSS code to improve performance.
  - _terser_: to minify/uglify your JS code to improve performance.

  These dependancies come ready to use, if you configured Input & Output files before, because the function automatically creates scripts to streamline the process of building your project.

- The testing suite, if you want to contribute to this project, the tests make sure that the important features of TCSG work correctly.

## [1.0.0] - 2024/03/24

_Initial release._
