import React from 'react';
import PropTypes from 'prop-types';

export default class VerifyCode extends React.Component {
  constructor(props) {
    super(props);
    this.code = '';
  }

  componentDidMount() {
    this.updateCode();
  }

  generateCode = () => {
    let code = '';
    let selectChar = [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
      'U',
      'V',
      'W',
      'X',
      'Y',
      'Z'
    ];
    for (let i = 0; i < 4; i++) {
      let charIndex = Math.floor(Math.random() * selectChar.length);
      code += selectChar[charIndex];
    }
    return code;
  };

  updateCode = () => {
    this.code = this.generateCode();
    const { width, height, padding } = this.props;
    let ctx = this.canvas.getContext('2d');
    // 背景
    ctx.fillStyle = '#f6f6f6';
    ctx.fillRect(0, 0, width, height);
    // 验证码
    ctx.font = height - padding * 2 + 'px sans-serif';
    ctx.fillStyle = '#767676';
    const itemWidth = (width - 2 * padding) / this.code.length;
    for (let i = 0; i < this.code.length; i++) {
      const text = this.code[i];
      const width = ctx.measureText(text).width;
      const a = (itemWidth - width) / 2;
      ctx.fillText(text, padding + itemWidth * i + a, height - (padding + 1));
    }
  };

  render() {
    const { width, height } = this.props;
    return (
      <canvas
        onClick={this.updateCode}
        width={width + 'px'}
        height={height + 'px'}
        ref={ref => (this.canvas = ref)}
      />
    );
  }
}

VerifyCode.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  padding: PropTypes.number
};

VerifyCode.defaultProps = {
  width: 100,
  height: 30,
  padding: 5
};
