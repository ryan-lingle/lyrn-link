module.exports = {
    theme: {
      fontFamily: {
        body: ["Work Sans", "-apple-system", "sans-serif"],
        fa: "'Font Awesome 5 Free'",
        mono: ["'Fira Mono'", "monospace"],
      },
      extend: {
        width: {
          unset: "unset",
          sidebar: "350px",
          video: "800px",
          99: "99%",
          "1/3": "33%",
        },
        maxWidth: {
          "1/2": "50%",
          '4/5': '80%',
        },
        maxHeight: {
          "1/2": "50%",
          "85": "85%",
          "80vh": "80vh",
        },
        minWidth: {
          fit: "fit",
        },
        inset: {
          "-2": "-0.5rem",
        },
        colors: {
          groundwork: {
            body: "#efefef",
            "table-border": "rgba(0,0,0,0.07)",
            black: '#000000',
            "dusty-blue": "#244046",
            "dusty-blue-highlight": "#e9ebec",
            "dusty-light-blue": "#354c51",
            "blue-light": "#d7dbdd",
            "new-blue": "#437682",
            gold: "rgb(255, 140, 69)",
            "gold-highlight": "#fff3ec",
            "off-white": "rgb(250, 250, 250)",
            "gray-light": "rgb(230, 230, 230)",
            "gray-med": "rgb(168, 168, 168)",
            "gray-dark": "rgb(100, 100, 100)",
            "gray-highlight": "#919fa2",
            green: "#3ad67f",
            "green-highlight": "#ebfaf2",
            olive: "rgb(48, 56, 41)",
            orange: "#FF4432",
            "orange-hover": "#e61300",
            "orange-highlight": "rgb(255, 236, 234)",
            "new-orange": '#FF6F5C',
            red: "#c04545",
            tan: "#ECDEC8",
            yellow: "#efcc3e",
            "yellow-highlight": "#fdf9eb",
          },
        },
        backgroundColor: {
          "gray-light": "rgb(239, 239, 239)",
        },
      },
    },
    variants: {
      margin: ["responsive", "last"],
    },
    plugins: [],
  };
  