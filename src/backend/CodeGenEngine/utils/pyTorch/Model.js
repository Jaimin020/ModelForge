export const modelTemplate = `import torch
import torch.nn as nn

class <%= model_name %>(nn.Module):
    def __init__(self):
        super(<%= model_name %>, self).__init__()
        <% layers.forEach((layer, index) => { %>
        this.layer<%= index + 1 %> = nn.<%= layer.type %>(<% if (layer.params) { %><%- layer.params.map(param => param.value).join(', ') %><% } %>)
        <% }) %>
    
    def forward(self, x):
        <% layers.forEach((layer, index) => { %>
        x = self.layer<%= index + 1 %>(x)
        <% }) %>
        return x
`;