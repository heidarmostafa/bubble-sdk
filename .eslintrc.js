module.exports = {
    "extends": "standard",
    "plugins": [
        "standard",
        "promise"
    ],
    "rules": {
        "semi": [2, "always"],
        'standard/object-curly-even-spacing': 0,
        'standard/array-bracket-even-spacing': 0,
        'standard/computed-property-even-spacing': 0,
        "indent": 0,
        "space-before-function-paren": 0,
        "padded-blocks": 0,
        "key-spacing": 0,
        "spaced-comment": 0
    },
    "globals": {
        "_": true,
        "angular": true,
        "$": true,
        "BubbleSDK": true,
        "window.performance": true,
        "location": true
    }
};