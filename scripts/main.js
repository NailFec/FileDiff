window.onload = function () {
    const input1 = document.getElementById('input1');
    const input2 = document.getElementById('input2');
    const dmp = new diff_match_patch();

    function escapeHtml(text) {
        return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;").replace(/'/g, "&#039;").replace(/\n/g, "<br>");
    }

    function compareTexts() {
        var text1 = escapeHtml(input1.value);
        var text2 = escapeHtml(input2.value);

        var diff = dmp.diff_main(text1, text2);
        dmp.diff_cleanupSemantic(diff);

        var html = [];
        var lineNum = 1;
        var insertCount = 0;
        var deleteCount = 0;
        for (var x = 0; x < diff.length; x++) {
            var op = diff[x][0];    // Operation (insert, delete, equal)
            var data = diff[x][1];  // Text of change.
            var text = data.split('\n');
            for (var y = 0; y < text.length; y++) {
                if (text[y].length > 0) {
                    switch (op) {
                        case DIFF_INSERT:
                            html.push('<p class="insert"><span class="line-number">+' + (lineNum + insertCount) + '</span>' + text[y] + '</p>');
                            insertCount++;
                            break;
                        case DIFF_DELETE:
                            html.push('<p class="delete"><span class="line-number">-' + (lineNum + deleteCount) + '</span>' + text[y] + '</p>');
                            deleteCount++;
                            break;
                        case DIFF_EQUAL:
                            html.push('<p><span class="line-number">' + lineNum + '</span>' + text[y] + '</p>');
                            lineNum++;
                            break;
                    }
                }
            }
        }

        document.getElementById('output2').innerHTML = html.join('');
        document.getElementById('count1').innerText = '字数: ' + input1.value.length;
        document.getElementById('count2').innerText = '字数: ' + input2.value.length;
        var similarity = dmp.diff_levenshtein(diff) / Math.max(text1.length, text2.length);
        document.getElementById('similarity').innerText = '相似度: ' + ((1 - similarity) * 100).toFixed(2) + '%';
    }

    input1.addEventListener('input', compareTexts);
    input2.addEventListener('input', compareTexts);

    // 初始化显示字数和相似度为0
    document.getElementById('count1').innerText = '字数: 0';
    document.getElementById('count2').innerText = '字数: 0';
    document.getElementById('similarity').innerText = '相似度: 0.00%';
}